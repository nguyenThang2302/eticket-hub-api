import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import momoGatewayConfig from '../../../config/momo.config';
import { MomoService } from './momo.service';
import { PaymentFactory } from './payment.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { PaymentOrder } from 'src/database/entities/payment_order.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { QRTicketService } from './qr-ticket.service';
import { MediaModule } from 'src/api/media/media.module';
import { PaypalService } from './paypal.service';
import { ExchangeRateService } from './exchange.service';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';

@Module({
  imports: [
    MediaModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Order,
      PaymentOrder,
      EventSeat,
      OrderTicketImage,
    ]),
    ConfigModule.forRoot({
      load: [momoGatewayConfig],
    }),
  ],
  controllers: [],
  providers: [
    MomoService,
    PaypalService,
    ExchangeRateService,
    QRTicketService,
    PaymentFactory,
  ],
  exports: [
    MomoService,
    PaypalService,
    ExchangeRateService,
    QRTicketService,
    PaymentFactory,
  ],
})
export class FactoryModule {}
