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

  async getListCouponByEvent(eventId: string) {
    const coupons = await this.couponRepository
      .createQueryBuilder('coupon')
      .innerJoinAndSelect('coupon.eventCoupons', 'event_coupon')
      .where('event_coupon.event_id = :eventId', { eventId })
      .andWhere('coupon.deleted_at IS NULL')
      .getMany();

    const items = coupons.map((coupon) => ({
      id: coupon.id,
      campaign_name: coupon.campaign_name,
      code: coupon.code,
      percent: coupon.percent,
      start_datetime: coupon.start_datetime,
      end_datetime: coupon.end_datetime,
      status: coupon.status,
    }));
    return { items: items };
  }

  async deleteCoupon(id: string, eventId: string) {
    const coupon = await this.couponRepository.findOne({
      where: {
        id,
      },
    });
    if (!coupon) {
      throw new Error('COUPON_NOT_FOUND');
    }
    const eventCoupon = await this.eventCouponRepository.findOne({
      where: {
        event: { id: eventId },
        coupon: coupon,
      },
    });
    if (!eventCoupon) {
      throw new Error('EVENT_COUPON_NOT_FOUND');
    }
    await this.eventCouponRepository.delete(eventCoupon.id);
    await this.couponRepository.update(coupon.id, {
      status: COUPON_STATUS.INACTIVE,
    });
    return await this.couponRepository.softDelete(coupon.id);
  }

  async getCouponDetail(id: string, eventId: string) {
    const existingEvent = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
    });
    if (!existingEvent) {
      throw new Error('EVENT_NOT_FOUND');
    }
    const coupon = await this.couponRepository.findOne({
      where: {
        id,
      },
    });

    if (!coupon) {
      throw new Error('COUPON_NOT_FOUND');
    }

    const result = {
      id: coupon.id,
      campaign_name: coupon.campaign_name,
      code: coupon.code,
      percent: coupon.percent,
      start_datetime: coupon.start_datetime,
      end_datetime: coupon.end_datetime,
      type: coupon.type,
    };

    return result;
  }

  async changeStatusCoupon(id: string, eventId: string) {
    const coupon = await this.couponRepository.findOne({
      where: {
        id,
      },
    });
    if (!coupon) {
      throw new Error('COUPON_NOT_FOUND');
    }
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }
    await this.couponRepository.update(coupon.id, {
      status:
        coupon.status === COUPON_STATUS.ACTIVE
          ? COUPON_STATUS.INACTIVE
          : COUPON_STATUS.ACTIVE,
    });
    return {
      id: coupon.id,
    };
  }

  async updateCoupon(id: any, createCouponDto: CreateCouponDto) {
    const { event_id, ...coupon } = createCouponDto;
    const existingEvent = await this.eventRepository.findOne({
      where: {
        id: event_id,
      },
    });
    if (!existingEvent) {
      throw new Error('EVENT_NOT_FOUND');
    }
    const existingCoupon = await this.couponRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!existingCoupon) {
      throw new Error('COUPON_NOT_FOUND');
    }
    await this.couponRepository.update(existingCoupon.id, coupon);
    return {
      id: existingCoupon.id,
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
