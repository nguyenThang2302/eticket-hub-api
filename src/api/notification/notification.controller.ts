import * as _ from 'lodash';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from 'jsonwebtoken';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { UserInOrganize } from '../common/guard/user-in-organize.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(
    @CurrentUser() user: JwtPayload,
    @Query() query: any,
  ) {
    const userId = _.get(user, 'sub', null);
    const { notifications, unreadCount } =
      await this.notificationService.getNotifications(userId, query);
    return { items: notifications, un_read_count: unreadCount };
  }

  @Get('organizes')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserInOrganize)
  async getOrganizerNotifications(@Req() req: Request, @Query() query: any) {
    const organizeId = req['auth']['organizeConfig']['organizeId'];
    const { notifications, unreadCount } =
      await this.notificationService.getNotifications(organizeId, query);
    return { items: notifications, un_read_count: unreadCount };
  }

  @Patch('read/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async markRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(id);
  }

  @Post('push')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async push(@Body() body: { userId: string; message: string }) {
    return this.notificationService.createNotification(
      body.userId,
      body.message,
    );
  }
}
