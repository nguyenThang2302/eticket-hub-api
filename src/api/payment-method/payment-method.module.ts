import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from 'src/database/entities/payment-method.entity';
import { PaymentOrder } from 'src/database/entities/payment_order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, PaymentOrder])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
