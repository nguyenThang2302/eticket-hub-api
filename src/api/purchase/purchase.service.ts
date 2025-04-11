import * as _ from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculatePriceRequestDto } from './dto/calculate-price-request.dto';
import { EventService } from '../event/event.service';
import { CouponService } from '../coupon/coupon.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { PaymentFactory } from './factories/payment.factory';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { DataSource, In } from 'typeorm';
import { Event } from 'src/database/entities/event.entity';
import { EVENT_STATUS, ORDER_STATUS, SEAT_STATUS } from '../common/constants';
import { ReceiveInfo } from 'src/database/entities/receive_info.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly eventService: EventService,
    private readonly couponService: CouponService,
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly paymentFactory: PaymentFactory,
    private datasource: DataSource,
  ) {}

  async calculatePrices(body: CalculatePriceRequestDto) {
    const { event_id: eventId, seats, coupon_code: couponCode } = body;

    const existingEvent = await this.eventService.isExistingEvent(eventId);
    if (!existingEvent) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }

    const isValidSeats = await this.seatService.isValidSeat(seats);
    if (!isValidSeats) {
      throw new BadRequestException('SEAT_NOT_AVAILABLE');
    }

    let subTotalPrice = 0;
    const tickets = seats.map((seat) => seat['ticket']);
    subTotalPrice = await this.ticketService.calculateTicketPrice(tickets);

    if (_.isNull(couponCode)) {
      return {
        sub_total_price: subTotalPrice,
        total_price: subTotalPrice,
      };
    }
    const coupon = await this.couponService.getCouponAvaiable(couponCode);
    if (!coupon) {
      throw new BadRequestException('COUPON_NOT_AVAILABLE');
    }
    const totalPice = subTotalPrice - subTotalPrice * coupon.percent;
    return {
      sub_total_price: subTotalPrice,
      discount_price: subTotalPrice * coupon.percent,
      total_price: totalPice,
    };
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const paymentMethodName =
      await this.paymentMethodService.getPaymentMethodNameById(
        createOrderDto.payment_method_id,
      );

    const seatIds = createOrderDto.seats.map((seat) => seat.id);
    const ticketIds = [
      ...new Set(createOrderDto.seats.map((seat) => seat.ticket.id)),
    ];
    let order: Order;

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      await queryRunner.manager.transaction(
        async (transactionalEntityManager) => {
          const event = await transactionalEntityManager.findOne(Event, {
            where: {
              status: EVENT_STATUS.ACTIVE,
              eventSeats: {
                id: In(seatIds),
                status: SEAT_STATUS.AVAILABLE,
                event_id: createOrderDto.event_id,
                ticket: {
                  id: In(ticketIds),
                },
              },
            },
            relations: ['eventSeats', 'eventSeats.ticket'],
            lock: { mode: 'pessimistic_write' },
          });
          if (!event) {
            throw new BadRequestException('EVENT_NOT_FOUND');
          }
          const tickets = event.eventSeats.map((seat) => seat.ticket);
          const totalPriceActual = tickets.reduce(
            (total, ticket) => total + parseInt(ticket.price.toString(), 10),
            0,
          );
          let discountPrice = 0;
          let couponId = null;
          if (!_.isNull(createOrderDto.coupon_code)) {
            const coupon = await this.couponService.getCouponAvaiable(
              createOrderDto.coupon_code,
            );
            discountPrice = totalPriceActual * coupon.percent;
            couponId = coupon.id;
          }
          if (
            createOrderDto.sub_total_price !== totalPriceActual ||
            createOrderDto.discount_price !== discountPrice ||
            createOrderDto.total_price !== totalPriceActual - discountPrice
          ) {
            throw new BadRequestException('ORDER_INVALID');
          }

          const receiveInfos = queryRunner.manager.create(ReceiveInfo, {
            id: nanoid(16),
            ...createOrderDto.receive_infos,
          });
          const savedReceiveInfo = await queryRunner.manager.save(ReceiveInfo, {
            ...receiveInfos,
          });

          const createdOrder = queryRunner.manager.create(Order, {
            id: nanoid(16),
            ...createOrderDto,
            receive_info_id: savedReceiveInfo.id,
            coupon_id: couponId,
            user_id: userId,
            status: ORDER_STATUS.PENDING,
          });

          const savedOrder = await queryRunner.manager.save(Order, {
            ...createdOrder,
          });
          order = savedOrder;
        },
      );
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      console.error('Error during transaction:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    }

    return this.paymentFactory.createPaymentMethod(
      paymentMethodName,
      createOrderDto,
      order.id,
    );
  }
}
