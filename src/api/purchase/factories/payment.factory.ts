import { Injectable, Scope } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { MomoService } from './momo.service';
import { PAYMENT_METHOD } from 'src/api/common/constants';
@Injectable({ scope: Scope.REQUEST })
export class PaymentFactory {
  constructor(private readonly momoService: MomoService) {}

  createPaymentMethod(method: string, order: CreateOrderDto, orderID: string) {
    switch (method) {
      case `${PAYMENT_METHOD.MOMO}`:
        return this.momoService.processingPayment(order, orderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }

  createCaptureOrder(method: string, orderID: number, paymentOrderID: string) {
    switch (method) {
      case `${PAYMENT_METHOD.MOMO}`:
        return this.momoService.captureOrder(orderID, paymentOrderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }

  cancelOrder(method: string, orderID: number, paymentOrderID: string) {
    switch (method) {
      case `${PAYMENT_METHOD.MOMO}`:
        return this.momoService.cancelOrder(orderID, paymentOrderID);
      default:
        throw new Error('Invalid implementation payment');
    }
  }
}
