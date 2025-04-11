import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { EventCoupon } from '../entities/event_coupon.entity';
import { Event } from '../entities/event.entity';
import { Coupon } from '../entities/coupon.entity';
import { nanoid } from 'nanoid';

export class EventCoupon1744292854893 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const eventCouponRepository = dataSource.getRepository(EventCoupon);
    const eventRepository = dataSource.getRepository(Event);
    const couponRepository = dataSource.getRepository(Coupon);

    const events = await eventRepository.find();
    const coupons = await couponRepository.find();

    const eventCoupons = [
      {
        id: nanoid(16),
        event: events[0],
        coupon: coupons[0],
      },
      {
        id: nanoid(16),
        event: events[1],
        coupon: coupons[1],
      },
      {
        id: nanoid(16),
        event: events[0],
        coupon: coupons[2],
      },
    ];

    for (const eventCoupon of eventCoupons) {
      const eventCouponData = eventCouponRepository.create(eventCoupon);
      await eventCouponRepository.save(eventCouponData);
    }
  }
}
