import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Organization } from '../entities/organization.entity';
import { Group } from '../entities/group.entity';
import { User } from '../entities';
import { ROLE } from 'src/api/common/constants';
import { nanoid } from 'nanoid';

export class Origanization1743526525557 implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const organizationRepository = dataSource.getRepository(Organization);
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    const promoter = await userRepository.findOne({
      where: { role: ROLE.PROMOTER },
    });
    const promoterId = promoter.id;

    const languageCodes = ['en', 'vi'];

    const organizations = [
      {
        name: 'TechExpo 2025',
        type: 'event',
        description: {
          en: 'TechExpo 2025 is an annual technology exhibition that brings together leading companies, startups, and technology enthusiasts. The event features keynote speeches, workshops, and product showcases.',
          vi: 'TechExpo 2025 là triển lãm công nghệ hàng năm quy tụ các công ty hàng đầu, startup và những người đam mê công nghệ. Sự kiện bao gồm các bài phát biểu quan trọng, hội thảo và trình diễn sản phẩm.',
        },
      },
      {
        name: 'International Film Festival',
        type: 'event',
        description: {
          en: 'The International Film Festival is a global event celebrating outstanding films from various genres and countries. It includes film screenings, award ceremonies, and networking opportunities for filmmakers.',
          vi: 'Liên hoan phim quốc tế là sự kiện toàn cầu tôn vinh những bộ phim xuất sắc thuộc nhiều thể loại và quốc gia khác nhau. Chương trình bao gồm các buổi chiếu phim, lễ trao giải và cơ hội kết nối cho các nhà làm phim.',
        },
      },
    ];

    for (const organization of organizations) {
      for (const langCode of languageCodes) {
        const data = await organizationRepository.insert({
          id: nanoid(16),
          name: organization.name,
          description: organization.description[langCode],
          is_active: true,
          status: 'active',
          logo_url: process.env.ORGANIZATION_LOGO_URL_DEFAULT,
          lang_code: langCode,
        });
        await groupRepository.insert({
          id: nanoid(16),
          user_id: promoterId,
          organization_id: data.identifiers[0].id,
          is_owner: true,
        });
      }
    }
  }
}
