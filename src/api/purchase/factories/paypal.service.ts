import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IPayment } from './payment.interface';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '../dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  SEAT_STATUS,
} from 'src/api/common/constants';
import { PaymentOrder } from 'src/database/entities/payment_order.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { QRTicketService } from './qr-ticket.service';
import { InjectQueue } from '@nestjs/bull';
import { CloudinaryService } from 'src/api/media/cloudinary/cloudinary.service';
import { Queue } from 'bull';
import { Order } from 'src/database/entities/order.entity';
import { nanoid } from 'nanoid';
import { ExchangeRateService } from './exchange.service';

@Injectable()
export class PaypalService implements IPayment {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PaymentOrder)
    private readonly paymentOrder: Repository<PaymentOrder>,
    @InjectRepository(Order)
    private readonly orderReposioty: Repository<Order>,
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
    private readonly qrticketService: QRTicketService,
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
    private readonly cloudinaryService: CloudinaryService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async processingPayment(order: CreateOrderDto, orderID: string) {
    const rateUSD = await this.exchangeRateService.getUsdToVndRate();
    const accessToken = await this.generateAccessToken();
    const url = `${this.configService.get<string>('paypal.paypal_url_base')}/v2/checkout/orders`;

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: Math.round(order.total_price / rateUSD),
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    try {
      const jsonResponse = await response.json();
      await this.createPaymentOrder(orderID, jsonResponse.id);
      return {
        order_id: orderID,
        payment_method_name: PAYMENT_METHOD.PAYPAL,
        payment_order_id: jsonResponse.id,
        status: ORDER_STATUS.PENDING,
        payment_url: jsonResponse.links[1].href,
        total: order.total_price,
      };
    } catch (error) {
      throw new Error('Error processing payment: ' + error.message);
    }
  }

  async generateAccessToken() {
    try {
      if (
        !this.configService.get<string>('paypal.paypal_client_id') ||
        !this.configService.get<string>('paypal.paypal_client_secret')
      ) {
        throw new ServiceUnavailableException('PAYMENT_FAILED');
      }

      const auth = Buffer.from(
        this.configService.get<string>('paypal.paypal_client_id') +
          ':' +
          this.configService.get<string>('paypal.paypal_client_secret'),
      ).toString('base64');

      const response = await fetch(
        `${this.configService.get<string>('paypal.paypal_url_base')}/v1/oauth2/token`,
        {
          method: 'POST',
          body: 'grant_type=client_credentials',
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new BadRequestException('PAYMENT_FAILED');
    }
  }

  async captureOrder(orderID: string, orderPaymentID: string, userID: string) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.configService.get<string>('paypal.paypal_url_base')}/v2/checkout/orders/${orderPaymentID}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const jsonResponse = await response.json();

    if (jsonResponse.status === 'COMPLETED') {
      const order = await this.orderReposioty
        .createQueryBuilder('orders')
        .innerJoin('orders.payment_orders', 'payment_orders') // Join with payment_orders
        .innerJoin('orders.receive_info', 'receive_info') // Join with receive_info
        .innerJoinAndSelect('orders.event', 'event') // Join with event
        .innerJoinAndSelect('event.organization', 'organization') // Join with organization
        .where('orders.id = :orderID', { orderID })
        .andWhere('orders.user_id = :userID', { userID })
        .andWhere('payment_orders.payment_order_id = :orderPaymentID', {
          orderPaymentID,
        })
        .select([
          'orders',
          'receive_info.name',
          'receive_info.phone_number',
          'receive_info.email',
          'event.name',
          'organization.id',
        ])
        .getOne();
      order.status = ORDER_STATUS.PAID;
      const seatInfo = JSON.parse(order.seat_info);
      const seatIds = seatInfo.map((seat: any) => seat.id);
      await this.eventSeatRepository.update(
        {
          id: In(seatIds),
        },
        {
          status: SEAT_STATUS.BOOKED,
        },
      );
      await this.orderReposioty.save(order);
      for (const seat of seatInfo) {
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const qrCodeTicket = await this.qrticketService.generateQRCode(code);
        const ticketInfo = {
          code: code,
          ticketId: seat.ticket_id,
          ticketName: seat.ticket.name,
          seatName: `${seat.row}-${seat.label}`,
          ticketPrice: seat.ticket.price,
        };
        await this.cloudinaryService.uploadQRTicket(
          qrCodeTicket,
          order.id,
          ticketInfo,
        );
      }
      const emailContent = {
        from: this.configService.get<object>('nestmailer.fromMailVerification'),
        recipients: [
          {
            name: order.receive_info.name,
            address: order.receive_info.email,
          },
        ],
        subject: 'Cormfirmation of your order',
        context: {
          orderId: order.id,
          userId: order.user_id,
          name: order.receive_info.name,
          email: order.receive_info.email,
          phoneNumber: order.receive_info.phone_number,
        },
        template: 'send-confirm-order',
      };
      await this.emailQueue.add('SendEmailConfirmOrder', emailContent);
      return {
        order_id: order.id,
        event_name: order.event.name,
        organizer_id: order.event.organization.id,
      };
    } else {
      throw new BadRequestException('PAYPAL_ERROR_GATEWAY');
    }
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
    const seatInfo = JSON.parse(order.seat_info);
    const seatIds = seatInfo.map((seat: any) => seat.id);
    const eventId = order.event_id;
    await this.eventSeatRepository.update(
      {
        id: In(seatIds),
        event_id: eventId,
        status: SEAT_STATUS.SELECTING,
      },
      {
        status: SEAT_STATUS.AVAILABLE,
      },
    );
    if (!order) {
      throw new BadRequestException('ORDER_IS_PAID');
    }
    order.status = ORDER_STATUS.CANCELLED;
    await this.orderReposioty.save(order);
    return {
      order_id: order.id,
    };
  }

  async createPaymentOrder(orderId: string, paymentOrderId: string) {
    const paymentOrder = this.paymentOrder.create({
      id: nanoid(16),
      order_id: orderId,
      payment_order_id: paymentOrderId,
    });
    return await this.paymentOrder.save(paymentOrder);
  }
}
