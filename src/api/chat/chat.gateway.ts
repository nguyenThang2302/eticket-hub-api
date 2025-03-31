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

interface UserSocket {
  userId: string;
  socketId: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private activeUsers: UserSocket[] = [];

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
  handlePrivateMessage(
    @MessageBody()
    data: { senderId: string; receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const receiver = this.activeUsers.find(
      (user) => user.userId === data.receiverId,
    );

    if (receiver) {
      client.to(receiver.socketId).emit('privateMessage', {
        senderId: data.senderId,
        message: data.message,
      });
    } else {
      console.log(`User ${data.receiverId} is not online`);
    }
  }
}
