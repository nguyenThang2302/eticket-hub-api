import { Ticket } from '../entities/ticket.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { nanoid } from 'nanoid';

export class Ticket1743776196558 implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const ticketRepository = dataSource.getRepository(Ticket);

    const ticketNames = [
      'VIP Class (No children under 8 years old)',
      'Regular Class (No children under 8 years old)',
    ];
    const prices = [320000, 270000];
    const amounts = [80, 100];

    for (let i = 0; i < ticketNames.length; i++) {
      await ticketRepository.insert({
        id: nanoid(16),
        name: ticketNames[i],
        price: prices[i],
        amount: amounts[i],
        lang_code: 'en',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }
}
