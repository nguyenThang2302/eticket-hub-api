import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('send')
  sendNotification(@Body() body: { userId: string; message: string }) {
    this.notificationService.notifyUser(body.userId, body.message);
    return { success: true, message: 'Notification sent' };
  }
}
