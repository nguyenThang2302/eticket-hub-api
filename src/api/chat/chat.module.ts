import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from 'src/database/model/message.schema';
import { ChatService } from './chat.service';
import { ChatProcessor } from './chat.processor';
import { ChatController } from './chat.controller';
import { OrganizeModule } from '../organize/organize.module';
import { UserModule } from '../user/user.module';
import { Group } from 'src/database/entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Organization } from 'src/database/entities/organization.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    TypeOrmModule.forFeature([Group, User, Organization]),
    OrganizeModule,
    UserModule,
  ],
  providers: [ChatGateway, ChatService, ChatProcessor],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
