import * as _ from 'lodash';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { Organization } from 'src/database/entities/organization.entity';

interface UserSocket {
  userId: string;
  socketId: string;
  organizationId?: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private activeUsers: UserSocket[] = [];

  constructor(
    private readonly chatService: ChatService,
    @InjectQueue('chatProcessing')
    private readonly chatQueue: Queue,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  afterInit(server: any) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers = this.activeUsers.filter(
      (user) => user.socketId !== client.id,
    );
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.activeUsers.push({ userId, socketId: client.id });
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      message: string;
      isOrganizer: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const receiver = this.activeUsers.find(
      (user) => user.userId === data.receiverId,
    );

    try {
      await this.chatService.saveMessage({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        isOrganizer: data.isOrganizer,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    if (receiver) {
      let sender = {};
      if (data.isOrganizer) {
        sender = await this.organizationRepository.findOne({
          where: { id: data.senderId },
          select: {
            id: true,
            name: true,
            logo_url: true,
          },
        });
        _.set(sender, 'avatar_url', _.get(sender, 'logo_url', null));
      } else {
        sender = await this.userRepository.findOne({
          where: { id: data.senderId },
        });
      }
      client.to(receiver.socketId).emit('privateMessage', {
        senderId: data.senderId,
        message: data.message,
        senderInfo: {
          id: _.get(sender, 'id', null),
          name: _.get(sender, 'name', null),
          avatar_url: _.get(sender, 'avatar_url', null),
        },
      });
    }
  }
}
