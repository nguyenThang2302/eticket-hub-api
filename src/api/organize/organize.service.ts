import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateOrganizeDto } from './dto/create-organize.dto';
import { REGISTER_ORGANIZATION_STATUS } from '../common/constants';
import { Group } from 'src/database/entities/group.entity';

@Injectable()
export class OrganizeService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizeRepository: Repository<Organization>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async registerOrganization(
    promoterId: string,
    languageCode: string,
    body: CreateOrganizeDto,
  ): Promise<any> {
    const organization = this.organizeRepository.create({
      lang_code: languageCode,
      name: body.name,
      description: body.description,
      is_active: false,
      status: REGISTER_ORGANIZATION_STATUS.WAITING,
      logo_url: process.env.ORGANNIZATION_LOGO_URL_DEFAULT,
    });
    const data = await this.organizeRepository.save(organization);
    const group = this.groupRepository.create({
      user_id: promoterId,
      organization_id: data.id,
      is_owner: true,
    });
    await this.groupRepository.save(group);
    return {
      id: data.id,
    };
  }

  async getOrganizationById(id: string): Promise<Organization> {
    return await this.organizeRepository.findOne({
      where: { id },
    });
  }

  async getOrganizations(userId: string, languageCode: string): Promise<any> {
    const organizations = await this.organizeRepository
      .createQueryBuilder('organization')
      .innerJoin('organization.groups', 'group')
      .where('group.user_id = :userId', { userId })
      .andWhere('organization.lang_code = :languageCode', { languageCode })
      .andWhere('organization.is_active = :isActive', { isActive: true })
      .select([
        'organization.id',
        'organization.name',
        'organization.description',
        'organization.logo_url',
        'organization.status',
        'organization.lang_code',
        'group.is_owner',
      ])
      .addSelect('group.user_id', 'userId')
      .getRawMany();
    const result = organizations.map((org) => ({
      id: org.organization_id,
      name: org.organization_name,
    }));
    return { items: result };
  }
}
