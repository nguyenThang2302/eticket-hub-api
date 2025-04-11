import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Coupon } from '../entities/coupon.entity';
import { nanoid } from 'nanoid';

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
        amount: 10,
      },
      {
        id: nanoid(16),
        code: 'EXTRA10',
        percent: 0.05,
        amount: 10,
      },
      {
        id: nanoid(16),
        code: 'WELCOME',
        percent: 0.15,
        amount: 10,
      },
    ];

    await couponRepository.insert(coupons);
  }
}
