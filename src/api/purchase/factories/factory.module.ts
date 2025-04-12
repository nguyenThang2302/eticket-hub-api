import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import momoGatewayConfig from '../../../config/momo.config';
import { MomoService } from './momo.service';
import { PaymentFactory } from './payment.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { PaymentOrder } from 'src/database/entities/payment_order.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order, PaymentOrder, EventSeat]),
    ConfigModule.forRoot({
      load: [momoGatewayConfig],
    }),
  ],
  controllers: [],
  providers: [MomoService, PaymentFactory],
  exports: [MomoService, PaymentFactory],
})
export class FactoryModule {}
