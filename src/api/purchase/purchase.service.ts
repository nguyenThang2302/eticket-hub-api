import * as _ from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculatePriceRequestDto } from './dto/calculate-price-request.dto';
import { EventService } from '../event/event.service';
import { CouponService } from '../coupon/coupon.service';
import { SeatService } from '../seat/seat.service';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly eventService: EventService,
    private readonly couponService: CouponService,
    private readonly seatService: SeatService,
    private readonly ticketService: TicketService,
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
}
