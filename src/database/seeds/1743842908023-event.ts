import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Event } from '../entities/event.entity';
import { Organization } from '../entities/organization.entity';
import { Venue } from '../entities/venue.entity';
import { nanoid } from 'nanoid';
import { Category } from '../entities/category.entity';
import { EVENT_STATUS } from 'src/api/common/constants';

export class Event1743777731297 implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const eventRepository = dataSource.getRepository(Event);
    const organizationRepository = dataSource.getRepository(Organization);
    const venueRepository = dataSource.getRepository(Venue);
    const categoryRepository = dataSource.getRepository(Category);

    const organizations = await organizationRepository.find({
      where: {
        lang_code: 'en',
      },
    });
    const venues = await venueRepository.find({
      where: {
        lang_code: 'en',
      },
    });
    const categories = await categoryRepository.find({
      where: {
        lang_code: 'en',
      },
    });

    const events = [
      {
        id: nanoid(16),
        name: '12 Bà Mụ',
        description: 'Một vở kịch về 12 bà Mụ huyền thoại.',
        logo_url:
          'https://salt.tkbcdn.com/ts/ds/7c/18/6f/b32013793b1dbda15606e1cca4ab40ac.jpg',
        poster_url:
          'https://salt.tkbcdn.com/ts/ds/7c/18/6f/b32013793b1dbda15606e1cca4ab40ac.jpg',
        start_datetime: new Date(),
        end_datetime: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: EVENT_STATUS.ACTIVE,
        organization: organizations[0],
        venue: venues[0],
        lang_code: 'vi',
        category: categories[0],
      },
      {
        id: nanoid(16),
        name: 'Đại Hội Yêu Quái - 7 Con Yêu Nhền Nhện',
        description: 'Diễn biến kỳ bí của 7 con yêu nhền nhện.',
        logo_url:
          'https://salt.tkbcdn.com/ts/ds/88/e2/26/921b29e67158c9ccd7a382d422b796d1.jpg',
        poster_url:
          'https://salt.tkbcdn.com/ts/ds/88/e2/26/921b29e67158c9ccd7a382d422b796d1.jpg',
        start_datetime: new Date(),
        end_datetime: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: EVENT_STATUS.ACTIVE,
        organization: organizations[0],
        venue: venues[1],
        lang_code: 'vi',
        category: categories[1],
      },
    ];

    for (const event of events) {
      const eventDataSaved = eventRepository.create(event);
      await eventRepository.save(eventDataSaved);
    }
  }
}
