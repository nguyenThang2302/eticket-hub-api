import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private notificationGateway: NotificationGateway) {}

  notifyUser(userId: string, message: string) {
    this.notificationGateway.sendNotificationToUser(userId, message);
  }
}
