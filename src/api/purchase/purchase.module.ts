import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { EventModule } from '../event/event.module';
import { CouponModule } from '../coupon/coupon.module';
import { SeatModule } from '../seat/seat.module';
import { TicketModule } from '../ticket/ticket.module';
import { FactoryModule } from './factories/factory.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { SeatProcessor } from './processor/release-seat.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, EventSeat]),
    FactoryModule,
    PaymentMethodModule,
    EventModule,
    CouponModule,
    SeatModule,
    TicketModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, SeatProcessor],
})
export class PurchaseModule {}
