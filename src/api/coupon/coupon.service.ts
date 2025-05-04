import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from 'src/database/entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Event } from 'src/database/entities/event.entity';
import { COUPON_STATUS } from '../common/constants';
import { EventCoupon } from 'src/database/entities/event_coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventCoupon)
    private readonly eventCouponRepository: Repository<EventCoupon>,
  ) {}

  async createCoupon(createCouponDto: CreateCouponDto) {
    const { event_id, ...coupon } = createCouponDto;
    const existingEvent = await this.eventRepository.findOne({
      where: {
        id: event_id,
      },
    });
    if (!existingEvent) {
      throw new Error('EVENT_NOT_FOUND');
    }
    const newCoupon = this.couponRepository.create({
      ...coupon,
      status: COUPON_STATUS.ACTIVE,
    });
    const savedCoupon = await this.couponRepository.save(newCoupon);
    const eventCoupon = this.eventCouponRepository.create({
      event: existingEvent,
      coupon: savedCoupon,
    });
    await this.eventCouponRepository.save(eventCoupon);
    return {
      id: savedCoupon.id,
    };
  }

  async getCouponAvaiable(code: string) {
    const coupon = await this.couponRepository.findOne({
      where: {
        code,
      },
    });
    return coupon;
  }
}
