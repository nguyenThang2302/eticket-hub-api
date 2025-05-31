import * as _ from 'lodash';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { ChatService } from './chat.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from 'jsonwebtoken';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('organizes')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getAllChatsOrganizer(@Req() req: Request) {
    const organizerId = _.get(req.headers, 'x-api-organize-id', null);
    return await this.chatService.getMessagesOrganizer(organizerId);
  }

  @Get('users')
  @Roles(ROLE.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getAllChatsUser(@CurrentUser() user: JwtPayload) {
    const userId = _.get(user, 'sub', null);
    return await this.chatService.getMessagesUser(userId);
  }

  @Get('details/:receiver_id/:sender_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getChatDetails(
    @Param('receiver_id') receiverId: string,
    @Param('sender_id') senderId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.chatService.getMessagesDetails(
      receiverId,
      senderId,
      page,
      limit,
    );
  }
}
