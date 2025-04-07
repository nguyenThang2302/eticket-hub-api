import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';

@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPaymentMethods() {
    return await this.paymentMethodService.getAllPaymentMethods();
  }
}
