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
      {
        name: 'Global Business Summit',
        type: 'event',
        description: {
          en: 'The Global Business Summit is a premier conference where industry leaders discuss trends, innovations, and strategies for business growth. It features expert panels, networking sessions, and investment opportunities.',
          vi: 'Hội nghị thượng đỉnh kinh doanh toàn cầu là một hội nghị hàng đầu, nơi các nhà lãnh đạo ngành thảo luận về xu hướng, đổi mới và chiến lược phát triển doanh nghiệp. Sự kiện bao gồm các phiên thảo luận chuyên gia, kết nối kinh doanh và cơ hội đầu tư.',
        },
      },
      {
        name: 'Health & Wellness Expo',
        type: 'event',
        description: {
          en: 'The Health & Wellness Expo is a health-focused event showcasing the latest advancements in fitness, nutrition, and mental well-being. Attendees can participate in workshops, product demonstrations, and health screenings.',
          vi: 'Triển lãm Sức khỏe & Thể chất là sự kiện tập trung vào sức khỏe, giới thiệu những tiến bộ mới nhất về thể dục, dinh dưỡng và tinh thần. Người tham gia có thể tham dự các hội thảo, trình diễn sản phẩm và kiểm tra sức khỏe.',
        },
      },
      {
        name: 'Green Future Conference',
        type: 'event',
        description: {
          en: 'The Green Future Conference is dedicated to sustainability and environmental protection. Experts and activists gather to discuss renewable energy, climate change, and green innovations.',
          vi: 'Hội nghị Tương lai Xanh dành riêng cho sự bền vững và bảo vệ môi trường. Các chuyên gia và nhà hoạt động cùng nhau thảo luận về năng lượng tái tạo, biến đổi khí hậu và đổi mới xanh.',
        },
      },
      {
        name: 'TicketMaster',
        type: 'ticketing',
        description: {
          en: 'TicketMaster is a global leader in event ticketing, providing a seamless experience for purchasing tickets to concerts, sports, and live performances.',
          vi: 'TicketMaster là công ty hàng đầu thế giới trong lĩnh vực bán vé sự kiện, cung cấp trải nghiệm mua vé mượt mà cho các buổi hòa nhạc, thể thao và biểu diễn trực tiếp.',
        },
      },
      {
        name: 'Eventbrite',
        type: 'ticketing',
        description: {
          en: 'Eventbrite is a popular online platform for discovering and booking tickets for various events, including business conferences, concerts, and workshops.',
          vi: 'Eventbrite là nền tảng trực tuyến phổ biến để khám phá và đặt vé cho nhiều sự kiện khác nhau, bao gồm hội nghị kinh doanh, hòa nhạc và hội thảo.',
        },
      },
      {
        name: 'StubHub',
        type: 'ticketing',
        description: {
          en: 'StubHub is a marketplace where users can buy and sell tickets for sports events, concerts, theater performances, and more.',
          vi: 'StubHub là một sàn giao dịch nơi người dùng có thể mua và bán vé cho các sự kiện thể thao, hòa nhạc, biểu diễn sân khấu và nhiều sự kiện khác.',
        },
      },
      {
        name: 'Viagogo',
        type: 'ticketing',
        description: {
          en: 'Viagogo is an international ticket resale platform offering tickets for concerts, festivals, sports games, and live shows worldwide.',
          vi: 'Viagogo là nền tảng bán lại vé quốc tế, cung cấp vé cho các buổi hòa nhạc, lễ hội, trận đấu thể thao và chương trình trực tiếp trên toàn thế giới.',
        },
      },
      {
        name: 'Biletix',
        type: 'ticketing',
        description: {
          en: 'Biletix is a leading ticketing service provider in several countries, specializing in cultural, music, and entertainment events.',
          vi: 'Biletix là nhà cung cấp dịch vụ bán vé hàng đầu tại nhiều quốc gia, chuyên về các sự kiện văn hóa, âm nhạc và giải trí.',
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
