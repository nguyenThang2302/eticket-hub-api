import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Event } from '../entities/event.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities';
import { ROLE } from 'src/api/common/constants';

export class Order1746888267634 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const eventRepository = dataSource.getRepository(Event);
    const orderRepository = dataSource.getRepository(Order);
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { role: ROLE.USER },
    });
    const events = await eventRepository
      .createQueryBuilder('event')
      .orderBy('RAND()')
      .limit(15)
      .getMany();
    for (const event of events) {
      const order = orderRepository.create({
        event_id: event.id,
        user_id: user.id,
      });
      await orderRepository.save(order);
    }
    console.log(`✅ Done seeding data for table: ${Order.name}`);
  }
}
