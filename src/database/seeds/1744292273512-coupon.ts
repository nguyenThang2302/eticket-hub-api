import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Coupon } from '../entities/coupon.entity';
import { nanoid } from 'nanoid';
import { COUPON_STATUS, COUPON_TYPE } from 'src/api/common/constants';

export class Coupon1744292273512 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const couponRepository = dataSource.getRepository(Coupon);

    const coupons = [
      {
        id: nanoid(16),
        code: 'SAVE10',
        percent: 0.1,
        type: COUPON_TYPE.PERCENTAGE,
        status: COUPON_STATUS.ACTIVE,
        start_datetime: new Date(),
        end_datetime: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
      {
        id: nanoid(16),
        code: 'EXTRA10',
        percent: 0.05,
        type: COUPON_TYPE.PERCENTAGE,
        status: COUPON_STATUS.ACTIVE,
        start_datetime: new Date(),
        end_datetime: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
      {
        id: nanoid(16),
        code: 'WELCOME',
        percent: 10000,
        type: COUPON_TYPE.FIXED,
        status: COUPON_STATUS.ACTIVE,
        start_datetime: new Date(),
        end_datetime: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    ];

    await couponRepository.insert(coupons);
    console.log(`✅ Done seeding data for table: ${Coupon.name}`);
  }
}
