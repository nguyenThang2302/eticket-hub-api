import { CreateOrderDto } from '../dto/create-order.dto';

export interface IPayment {
  processingPayment(order: CreateOrderDto, oderID: string): any;

  captureOrder(orderID: string, orderPaymentID: string, userID: string): any;

  cancelOrder(orderID: string, paymentOrderID: string, userID: string): any;
}
