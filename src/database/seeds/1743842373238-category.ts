import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Category } from '../entities/category.entity';
import { nanoid } from 'nanoid';

export class Category1743842373238 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
      {
        id: nanoid(16),
        name: 'Music',
        lang_code: 'en',
      },
      {
        id: nanoid(16),
        name: 'Âm nhạc',
        lang_code: 'vi',
      },
      {
        id: nanoid(16),
        name: 'Theaters & Art',
        lang_code: 'en',
      },
      {
        id: nanoid(16),
        name: 'Sân khấu & Nghệ thuật',
        lang_code: 'vi',
      },
      {
        id: nanoid(16),
        name: 'Sport',
        lang_code: 'en',
      },
      {
        id: nanoid(16),
        name: 'Thể thao',
        lang_code: 'vi',
      },
      {
        id: nanoid(16),
        name: 'Others',
        lang_code: 'en',
      },
      {
        id: nanoid(16),
        name: 'Khác',
        lang_code: 'vi',
      },
    ];

    await categoryRepository.insert(categories);

    console.log(`✅ Done seeding data for table: ${Category.name}`);
  }
}
