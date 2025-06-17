import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationSchema,
  Notification,
} from 'src/database/model/notification.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { UserModule } from '../user/user.module';
import { OrganizeModule } from '../organize/organize.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UserModule,
    OrganizeModule,
  ],
  providers: [NotificationGateway, NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
