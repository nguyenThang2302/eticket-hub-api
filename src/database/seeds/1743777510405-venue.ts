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
        name: 'Nhà Hát Kịch IDECAF',
        address:
          'Số 28 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, Thành Phố Hồ Chí Minh',
        description:
          'Một địa điểm rộng rãi thích hợp cho các hội nghị và sự kiện.',
        lang_code: 'vi',
      },
      {
        id: nanoid(16),
        name: 'Nhà Văn hoá Thanh niên Thành phố Hồ Chí Minh',
        address:
          '4 Phạm Ngọc Thạch, Bến Nghé, Phường Bến Nghé, Quận 1, Thành Phố Hồ Chí Minh',
        description:
          'Một địa điểm ngoài trời để tổ chức hòa nhạc và biểu diễn.',
        lang_code: 'vi',
      },
    ];

    await venueRepository.insert(venues);
  }
}
