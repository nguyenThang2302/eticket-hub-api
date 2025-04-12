import { BadRequestException, Injectable } from '@nestjs/common';
import { IPayment } from './payment.interface';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '../dto/create-order.dto';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  SEAT_STATUS,
} from 'src/api/common/constants';
import { PaymentOrder } from 'src/database/entities/payment_order.entity';
import { nanoid } from 'nanoid';
import { Order } from 'src/database/entities/order.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';

@Injectable()
export class MomoService implements IPayment {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PaymentOrder)
    private readonly paymentOrder: Repository<PaymentOrder>,
    @InjectRepository(Order)
    private readonly orderReposioty: Repository<Order>,
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
  ) {}

  async processingPayment(order: CreateOrderDto, orderID: string) {
    const requestId =
      this.configService.get<string>('momo_gateway.mm_partner_code') +
      new Date().getTime();
    const signature = crypto
      .createHmac(
        'sha256',
        this.configService.get<string>('momo_gateway.mm_secret_key'),
      )
      .update(await this.rawSignature(order.total_price, requestId))
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: this.configService.get<string>(
        'momo_gateway.mm_partner_code',
      ),
      accessKey: this.configService.get<string>('momo_gateway.mm_access_key'),
      requestId: requestId,
      amount: order.total_price,
      orderId: requestId,
      orderInfo: this.configService.get<string>('momo_gateway.mm_order_info'),
      redirectUrl: this.configService.get<string>(
        'momo_gateway.mm_redirect_url',
      ),
      ipnUrl: this.configService.get<string>('momo_gateway.mm_ipn_url'),
      extraData: '',
      requestType: this.configService.get<string>(
        'momo_gateway.mm_request_type',
      ),
      signature: signature,
      lang: 'en',
    });

    const hostname = this.configService.get('momo_gateway.mm_host_name');
    const port = this.configService.get('momo_gateway.mm_port');
    const url = `https://${hostname}:${port}/v2/gateway/api/create`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody).toString(),
      },
      body: requestBody,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      await this.createPaymentOrder(orderID, data.orderId);
      return {
        order_id: orderID,
        payment_method_name: PAYMENT_METHOD.MOMO,
        payment_order_id: data.orderId,
        status: ORDER_STATUS.PENDING,
        payment_url: data.payUrl,
        total: order.total_price,
      };
    } catch (error) {
      throw new Error('Error processing payment: ' + error.message);
    }
  }

  async rawSignature(amount: number, requestId: string) {
    const accessKey = this.configService.get<string>(
      'momo_gateway.mm_access_key',
    );
    const extraData = '';
    const ipnUrl = this.configService.get<string>('momo_gateway.mm_ipn_url');
    const orderId = requestId;
    const orderInfo = this.configService.get<string>(
      'momo_gateway.mm_order_info',
    );
    const partnerCode = this.configService.get<string>(
      'momo_gateway.mm_partner_code',
    );
    const redirectUrl = this.configService.get<string>(
      'momo_gateway.mm_redirect_url',
    );
    const requestType = this.configService.get<string>(
      'momo_gateway.mm_request_type',
    );
    return (
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType
    );
  }

  async createPaymentOrder(orderId: string, paymentOrderId: string) {
    const paymentOrder = this.paymentOrder.create({
      id: nanoid(16),
      order_id: orderId,
      payment_order_id: paymentOrderId,
    });
    return await this.paymentOrder.save(paymentOrder);
  }

  async captureOrder(orderID: string, orderPaymentID: string, userID: string) {
    const order = await this.orderReposioty
      .createQueryBuilder('orders')
      .innerJoin('orders.payment_orders', 'payment_orders')
      .where('orders.id = :orderID', { orderID })
      .andWhere('orders.user_id = :userID', { userID })
      .andWhere('payment_orders.payment_order_id = :orderPaymentID', {
        orderPaymentID,
      })
      .getOne();
    order.status = ORDER_STATUS.PAID;
    const seatInfo = JSON.parse(order.seat_info);
    const seatIds = seatInfo.map((seat) => seat.id);
    await this.eventSeatRepository.update(
      {
        id: In(seatIds),
      },
      {
        status: SEAT_STATUS.BOOKED,
      },
    );
    await this.orderReposioty.save(order);
    return {
      order_id: order.id,
    };
  }

  async cancelOrder(orderID: string, orderPaymentID: string, userID: string) {
    const order = await this.orderReposioty
      .createQueryBuilder('orders')
      .innerJoin('orders.payment_orders', 'payment_orders')
      .where('orders.id = :orderID', { orderID })
      .andWhere('orders.user_id = :userID', { userID })
      .andWhere('orders.status != :status', {
        status: ORDER_STATUS.PAID,
      })
      .andWhere('payment_orders.payment_order_id = :orderPaymentID', {
        orderPaymentID,
      })
      .getOne();
    if (!order) {
      throw new BadRequestException('ORDER_IS_PAID');
    }
    order.status = ORDER_STATUS.CANCELLED;
    await this.orderReposioty.save(order);
    return {
      order_id: order.id,
    };
  }
}
