import { Injectable, Scope } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { MomoService } from './momo.service';
import { PAYMENT_METHOD } from 'src/api/common/constants';
import { PaypalService } from './paypal.service';
@Injectable({ scope: Scope.REQUEST })
export class PaymentFactory {
  constructor(
    private readonly momoService: MomoService,
    private readonly paypalService: PaypalService,
  ) {}

  createPaymentMethod(method: string, order: CreateOrderDto, orderID: string) {
    switch (method) {
      case `${PAYMENT_METHOD.MOMO}`:
        return this.momoService.processingPayment(order, orderID);
      case `${PAYMENT_METHOD.PAYPAL}`:
        return this.paypalService.processingPayment(order, orderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }

  createCaptureOrder(
    method: string,
    orderID: string,
    paymentOrderID: string,
    userID: string,
  ) {
    switch (method) {
      case `${PAYMENT_METHOD.MOMO}`:
        return this.momoService.captureOrder(orderID, paymentOrderID, userID);
      case `${PAYMENT_METHOD.PAYPAL}`:
        return this.paypalService.captureOrder(orderID, paymentOrderID, userID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }

  cancelOrder(
    method: string,
    orderID: string,
    paymentOrderID: string,
    userID: string,
  ) {
    switch (method) {
      case `${PAYMENT_METHOD.MOMO}`:
        return this.momoService.cancelOrder(orderID, paymentOrderID, userID);
      case `${PAYMENT_METHOD.PAYPAL}`:
        return this.paypalService.cancelOrder(orderID, paymentOrderID, userID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }
}
