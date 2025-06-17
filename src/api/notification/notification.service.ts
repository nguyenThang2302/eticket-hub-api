import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationGateway } from './notification.gateway';
import {
  Notification,
  NotificationDocument,
} from 'src/database/model/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private gateway: NotificationGateway,
  ) {}

  async createNotification(userId: string, message: string) {
    const notification = new this.notificationModel({ userId, message });
    await notification.save();
    this.gateway.sendNotification(userId, notification);
    return notification;
  }

  async getNotifications(userId: string, query: any) {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const unreadCount = await this.notificationModel.countDocuments({
      userId,
      isRead: false,
    });

    return {
      notifications,
      unreadCount,
    };
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, {
      isRead: true,
    });
  }
}
