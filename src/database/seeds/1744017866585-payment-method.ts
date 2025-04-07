import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { PaymentMethod } from '../entities/payment-method.entity';
import { nanoid } from 'nanoid';

export class PaymentMethod1744017866585 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const paymentMethodRepository = dataSource.getRepository(PaymentMethod);

    const paymentMethods = [
      {
        id: nanoid(16),
        name: 'Momo',
        logo_url:
          'https://res.cloudinary.com/dxsdyc667/image/upload/v1743954668/profiles/nzruan7dr1nggcfee2zz.png',
      },
      {
        id: nanoid(16),
        name: 'Paypal',
        logo_url:
          'https://res.cloudinary.com/dxsdyc667/image/upload/v1743954732/profiles/xlbjgtnztd1hrhlkumbu.svg',
      },
    ];

    await paymentMethodRepository.insert(paymentMethods);
  }
}
