import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/database/entities/coupon.entity';
import { Group } from 'src/database/entities/group.entity';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';
import { OrganizeModule } from '../organize/organize.module';
import { UserModule } from '../user/user.module';
import { Event } from 'src/database/entities/event.entity';
import { EventCoupon } from 'src/database/entities/event_coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coupon,
      Group,
      Event,
      EventCoupon,
      OrderTicketImage,
    ]),
    OrganizeModule,
    UserModule,
  ],
  providers: [CouponService],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
