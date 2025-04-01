import { ROLE } from 'src/api/common/constants';
import { User } from '../entities';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { nanoid } from 'nanoid';

export class User1710214395381 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const fullNames = ['Emily Johnson', 'Daniel Smith', 'Olivia Davis'];
    const emails = [
      'eTicketHubUser@example.com',
      'eTicketHubPromoter@example.com',
      'eTicketHubAdmin@example.com',
    ];
    const roles = [ROLE.USER, ROLE.PROMOTER, ROLE.ADMIN];

    for (let i = 0; i < 3; i++) {
      await userRepository.insert({
        id: nanoid(16),
        name: fullNames[i],
        email: emails[i],
        avatar_url: process.env.AVATAR_URL_DEFAULT,
        password:
          '$2b$10$6o2Aqaat69/RnjM9TX2FvOTfeJZeG5i7t1W9mSRGmIkG6GET5lhby',
        is_verified: true,
        role: roles[i],
      });
    }
  }
}
