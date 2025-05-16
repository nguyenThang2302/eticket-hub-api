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

    for (const event of events) {
      for (const coupon of coupons) {
        const eventCoupon = eventCouponRepository.create({
          id: nanoid(16),
          event,
          coupon,
        });
        await eventCouponRepository.save(eventCoupon);
      }
    }
    console.log(`✅ Done seeding data for table: ${EventCoupon.name}`);
  }
}
