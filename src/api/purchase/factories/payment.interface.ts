import { CreateOrderDto } from '../dto/create-order.dto';

export interface IPayment {
  processingPayment(order: CreateOrderDto, oderID: string): any;

  captureOrder(orderID: number, orderPaymentID: string): any;

  cancelOrder(orderID: number, paymentOrderID: string): any;
}
