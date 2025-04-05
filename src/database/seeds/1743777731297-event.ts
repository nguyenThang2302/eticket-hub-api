import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Event } from '../entities/event.entity';
import { Organization } from '../entities/organization.entity';
import { Venue } from '../entities/venue.entity';
import { nanoid } from 'nanoid';

export class Event1743777731297 implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const eventRepository = dataSource.getRepository(Event);
    const organizationRepository = dataSource.getRepository(Organization);
    const venueRepository = dataSource.getRepository(Venue);

    const organizations = await organizationRepository.find();
    const venues = await venueRepository.find();
    const organizationIds = organizations.map(
      (organization) => organization.id,
    );
    const venueIds = venues.map((venue) => venue.id);

    const events = [
      {
        id: nanoid(16),
        name: '12 Bà Mụ',
        description: 'Một vở kịch về 12 bà Mụ huyền thoại.',
        type: 'hai_kich',
        logo_url:
          '	https://salt.tkbcdn.com/ts/ds/7c/18/6f/b32013793b1dbda15606e1cca4ab40ac.jpg',
        poster_url:
          '	https://salt.tkbcdn.com/ts/ds/7c/18/6f/b32013793b1dbda15606e1cca4ab40ac.jpg',
        start_datetime: new Date('2023-12-01T09:00:00'),
        status: 'active',
        organization_id: organizationIds[0],
        venue_id: venueIds[0],
        lang_code: 'vi',
      },
      {
        id: nanoid(16),
        name: 'Đại Hội Yêu Quái - 7 Con Yêu Nhền Nhện',
        description: 'Diễn biến kỳ bí của 7 con yêu nhền nhện.',
        type: 'hai_kich',
        logo_url:
          '	https://salt.tkbcdn.com/ts/ds/88/e2/26/921b29e67158c9ccd7a382d422b796d1.jpg',
        poster_url:
          '	https://salt.tkbcdn.com/ts/ds/88/e2/26/921b29e67158c9ccd7a382d422b796d1.jpg',
        start_datetime: new Date('2023-12-15T18:00:00'),
        status: 'active',
        organization_id: organizationIds[1],
        venue_id: venueIds[1],
        lang_code: 'vi',
      },
    ];

    await eventRepository.insert(events);
  }
}
