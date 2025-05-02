import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Venue } from '../entities/venue.entity';
import { nanoid } from 'nanoid';

export class Venue1743777510405 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const venueRepository = dataSource.getRepository(Venue);

    const venues = [
      {
        id: nanoid(16),
        name: 'IDECAF Drama Theatre',
        address:
          'No. 28 Le Thanh Ton, Ben Nghe Ward, District 1, Ho Chi Minh City',
        lang_code: 'en',
      },
      {
        id: nanoid(16),
        name: 'Ho Chi Minh City Youth Cultural House',
        address:
          '4 Pham Ngoc Thach, Ben Nghe, Ben Nghe Ward, District 1, Ho Chi Minh City',
        lang_code: 'en',
      },
    ];

    await venueRepository.insert(venues);
  }
}
