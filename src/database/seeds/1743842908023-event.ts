import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Event } from '../entities/event.entity';
import { Organization } from '../entities/organization.entity';
import { Venue } from '../entities/venue.entity';
import { nanoid } from 'nanoid';
import { Category } from '../entities/category.entity';
import { EVENT_STATUS } from 'src/api/common/constants';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

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
    const categoryMusic = await categoryRepository.findOne({
      where: {
        lang_code: 'en',
        name: 'Music',
      },
    });
    const categoryTheater = await categoryRepository.findOne({
      where: {
        lang_code: 'en',
        name: 'Theaters & Art',
      },
    });
    const categorySport = await categoryRepository.findOne({
      where: {
        lang_code: 'en',
        name: 'Sport',
      },
    });
    const categoryOther = await categoryRepository.findOne({
      where: {
        lang_code: 'en',
        name: 'Others',
      },
    });

    const csvFilePathMusic = path.join(__dirname, '../data/music.csv');
    const csvDataMusic: { images: string; name: string }[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePathMusic)
        .pipe(csv())
        .on('data', (row) => {
          csvDataMusic.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    const csvFilePathTheater = path.join(__dirname, '../data/theater.csv');
    const csvDataThater: { images: string; name: string }[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePathTheater)
        .pipe(csv())
        .on('data', (row) => {
          csvDataThater.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    const csvFilePathSport = path.join(__dirname, '../data/sport.csv');
    const csvDataSport: { images: string; name: string }[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePathSport)
        .pipe(csv())
        .on('data', (row) => {
          csvDataSport.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    const csvFilePathOthers = path.join(__dirname, '../data/others.csv');
    const csvDataOthers: { images: string; name: string }[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePathOthers)
        .pipe(csv())
        .on('data', (row) => {
          csvDataOthers.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    const eventMusics = csvDataMusic.map((row) => ({
      id: nanoid(16),
      name: row.name,
      logo_url: row.images,
      poster_url: row.images,
      start_datetime: new Date(),
      end_datetime: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: `<p><strong>Giới thiệu sự kiện:</strong></p> <p>[T&oacute;m tắt ngắn gọn về sự kiện: Nội dung ch&iacute;nh của sự kiện, điểm đặc sắc nhất v&agrave; l&yacute; do khiến người tham gia kh&ocirc;ng n&ecirc;n bỏ lỡ]</p> <p><strong>Chi tiết sự kiện:</strong></p> <ul> <li><strong>Chương tr&igrave;nh ch&iacute;nh:</strong> [Liệt k&ecirc; những hoạt động nổi bật trong sự kiện: c&aacute;c phần tr&igrave;nh diễn, kh&aacute;ch mời đặc biệt, lịch tr&igrave;nh c&aacute;c tiết mục cụ thể nếu c&oacute;.]</li> <li><strong>Kh&aacute;ch mời:</strong> [Th&ocirc;ng tin về c&aacute;c kh&aacute;ch mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. C&oacute; thể bao gồm phần m&ocirc; tả ngắn gọn về họ v&agrave; những g&igrave; họ sẽ mang lại cho sự kiện.]</li> <li><strong>Trải nghiệm đặc biệt:</strong> [Nếu c&oacute; c&aacute;c hoạt động đặc biệt kh&aacute;c như workshop, khu trải nghiệm, photo booth, khu vực check-in hay c&aacute;c phần qu&agrave;/ưu đ&atilde;i d&agrave;nh ri&ecirc;ng cho người tham dự.]</li> </ul> <p><strong>Điều khoản v&agrave; điều kiện:</strong></p> <p>[TnC] sự kiện</p> <p>Lưu &yacute; về điều khoản trẻ em</p> <p>Lưu &yacute; về điều khoản VAT</p>`,
      status: EVENT_STATUS.ACTIVE,
      organization: organizations[0],
      allow_scan_ticket: true,
      venue: venues[0],
      lang_code: 'en',
      category: categoryMusic,
    }));
    const eventTheaters = csvDataThater.map((row) => ({
      id: nanoid(16),
      name: row.name,
      logo_url: row.images,
      poster_url: row.images,
      start_datetime: new Date(),
      end_datetime: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: `<p><strong>Giới thiệu sự kiện:</strong></p> <p>[T&oacute;m tắt ngắn gọn về sự kiện: Nội dung ch&iacute;nh của sự kiện, điểm đặc sắc nhất v&agrave; l&yacute; do khiến người tham gia kh&ocirc;ng n&ecirc;n bỏ lỡ]</p> <p><strong>Chi tiết sự kiện:</strong></p> <ul> <li><strong>Chương tr&igrave;nh ch&iacute;nh:</strong> [Liệt k&ecirc; những hoạt động nổi bật trong sự kiện: c&aacute;c phần tr&igrave;nh diễn, kh&aacute;ch mời đặc biệt, lịch tr&igrave;nh c&aacute;c tiết mục cụ thể nếu c&oacute;.]</li> <li><strong>Kh&aacute;ch mời:</strong> [Th&ocirc;ng tin về c&aacute;c kh&aacute;ch mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. C&oacute; thể bao gồm phần m&ocirc; tả ngắn gọn về họ v&agrave; những g&igrave; họ sẽ mang lại cho sự kiện.]</li> <li><strong>Trải nghiệm đặc biệt:</strong> [Nếu c&oacute; c&aacute;c hoạt động đặc biệt kh&aacute;c như workshop, khu trải nghiệm, photo booth, khu vực check-in hay c&aacute;c phần qu&agrave;/ưu đ&atilde;i d&agrave;nh ri&ecirc;ng cho người tham dự.]</li> </ul> <p><strong>Điều khoản v&agrave; điều kiện:</strong></p> <p>[TnC] sự kiện</p> <p>Lưu &yacute; về điều khoản trẻ em</p> <p>Lưu &yacute; về điều khoản VAT</p>`,
      status: EVENT_STATUS.ACTIVE,
      organization: organizations[0],
      venue: venues[0],
      allow_scan_ticket: true,
      lang_code: 'en',
      category: categoryTheater,
    }));
    const eventSport = csvDataThater.map((row) => ({
      id: nanoid(16),
      name: row.name,
      logo_url: row.images,
      poster_url: row.images,
      start_datetime: new Date(),
      end_datetime: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: `<p><strong>Giới thiệu sự kiện:</strong></p> <p>[T&oacute;m tắt ngắn gọn về sự kiện: Nội dung ch&iacute;nh của sự kiện, điểm đặc sắc nhất v&agrave; l&yacute; do khiến người tham gia kh&ocirc;ng n&ecirc;n bỏ lỡ]</p> <p><strong>Chi tiết sự kiện:</strong></p> <ul> <li><strong>Chương tr&igrave;nh ch&iacute;nh:</strong> [Liệt k&ecirc; những hoạt động nổi bật trong sự kiện: c&aacute;c phần tr&igrave;nh diễn, kh&aacute;ch mời đặc biệt, lịch tr&igrave;nh c&aacute;c tiết mục cụ thể nếu c&oacute;.]</li> <li><strong>Kh&aacute;ch mời:</strong> [Th&ocirc;ng tin về c&aacute;c kh&aacute;ch mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. C&oacute; thể bao gồm phần m&ocirc; tả ngắn gọn về họ v&agrave; những g&igrave; họ sẽ mang lại cho sự kiện.]</li> <li><strong>Trải nghiệm đặc biệt:</strong> [Nếu c&oacute; c&aacute;c hoạt động đặc biệt kh&aacute;c như workshop, khu trải nghiệm, photo booth, khu vực check-in hay c&aacute;c phần qu&agrave;/ưu đ&atilde;i d&agrave;nh ri&ecirc;ng cho người tham dự.]</li> </ul> <p><strong>Điều khoản v&agrave; điều kiện:</strong></p> <p>[TnC] sự kiện</p> <p>Lưu &yacute; về điều khoản trẻ em</p> <p>Lưu &yacute; về điều khoản VAT</p>`,
      status: EVENT_STATUS.ACTIVE,
      organization: organizations[0],
      venue: venues[0],
      allow_scan_ticket: true,
      lang_code: 'en',
      category: categorySport,
    }));
    const eventOthers = csvDataThater.map((row) => ({
      id: nanoid(16),
      name: row.name,
      logo_url: row.images,
      poster_url: row.images,
      start_datetime: new Date(),
      end_datetime: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: `<p><strong>Giới thiệu sự kiện:</strong></p> <p>[T&oacute;m tắt ngắn gọn về sự kiện: Nội dung ch&iacute;nh của sự kiện, điểm đặc sắc nhất v&agrave; l&yacute; do khiến người tham gia kh&ocirc;ng n&ecirc;n bỏ lỡ]</p> <p><strong>Chi tiết sự kiện:</strong></p> <ul> <li><strong>Chương tr&igrave;nh ch&iacute;nh:</strong> [Liệt k&ecirc; những hoạt động nổi bật trong sự kiện: c&aacute;c phần tr&igrave;nh diễn, kh&aacute;ch mời đặc biệt, lịch tr&igrave;nh c&aacute;c tiết mục cụ thể nếu c&oacute;.]</li> <li><strong>Kh&aacute;ch mời:</strong> [Th&ocirc;ng tin về c&aacute;c kh&aacute;ch mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. C&oacute; thể bao gồm phần m&ocirc; tả ngắn gọn về họ v&agrave; những g&igrave; họ sẽ mang lại cho sự kiện.]</li> <li><strong>Trải nghiệm đặc biệt:</strong> [Nếu c&oacute; c&aacute;c hoạt động đặc biệt kh&aacute;c như workshop, khu trải nghiệm, photo booth, khu vực check-in hay c&aacute;c phần qu&agrave;/ưu đ&atilde;i d&agrave;nh ri&ecirc;ng cho người tham dự.]</li> </ul> <p><strong>Điều khoản v&agrave; điều kiện:</strong></p> <p>[TnC] sự kiện</p> <p>Lưu &yacute; về điều khoản trẻ em</p> <p>Lưu &yacute; về điều khoản VAT</p>`,
      status: EVENT_STATUS.ACTIVE,
      organization: organizations[0],
      allow_scan_ticket: true,
      venue: venues[0],
      lang_code: 'en',
      category: categoryOther,
    }));

    const events = [
      ...eventMusics,
      ...eventTheaters,
      ...eventSport,
      ...eventOthers,
    ];

    for (const event of events) {
      const eventDataSaved = eventRepository.create(event);
      await eventRepository.save(eventDataSaved);
    }

    console.log(`✅ Done seeding data for table: ${Event.name}`);
  }
}
