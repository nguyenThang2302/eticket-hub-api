import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { User } from 'src/database/entities';
import { UserModule } from '../user/user.module';
import { Organization } from 'src/database/entities/organization.entity';
import { Order } from 'src/database/entities/order.entity';
import { Category } from 'src/database/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User, Organization, Order, Category]),
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
