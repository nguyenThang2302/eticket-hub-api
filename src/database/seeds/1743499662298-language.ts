import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { nanoid } from 'nanoid';
import { Language } from '../entities/language.entity';

export class LanguageSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const languageRepository = dataSource.getRepository(Language);

    const languages = [
      { code: 'vi', name: 'Vietnamese' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'French' },
      { code: 'es', name: 'Spanish' },
      { code: 'de', name: 'German' },
      { code: 'zh', name: 'Chinese' },
    ];

    for (const language of languages) {
      await languageRepository.insert({
        id: nanoid(16),
        code: language.code,
        name: language.name,
      });
    }
  }
}
