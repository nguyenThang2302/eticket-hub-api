import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateOrganizeDto } from './dto/create-organize.dto';
import { REGISTER_ORGANIZATION_STATUS } from '../common/constants';
import { Group } from 'src/database/entities/group.entity';
import { Event } from 'src/database/entities/event.entity';

@Injectable()
export class OrganizeService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizeRepository: Repository<Organization>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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

  async checkUserInOrganize(
    userId: string,
    organizeId: string,
  ): Promise<boolean> {
    const group = await this.groupRepository.findOne({
      where: {
        user_id: userId,
        organization_id: organizeId,
      },
    });
    return !!group;
  }

  async getEvents(organizeId: string, params: any): Promise<any> {
    const totalEvents = await this.eventRepository.countBy({
      organization: { id: organizeId },
    });
    const { page = 1, limit = 10 } = params;
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .innerJoin('event.venue', 'venue')
      .where('organization.id = :organizeId', { organizeId })
      .select([
        'event.id',
        'event.name',
        'event.start_datetime',
        'event.status',
        'event.allow_scan_ticket',
        'venue.name',
        'venue.address',
      ])
      .limit(parseInt(limit))
      .offset(parseInt(limit) * (parseInt(page) - 1))
      .getMany();

    const totalPages = Math.ceil(totalEvents / parseInt(limit));

    const paginations = {
      total: totalEvents,
      limit: parseInt(limit),
      page: parseInt(page),
      current_page: parseInt(page),
      total_page: totalPages,
      has_next_page: parseInt(page) < totalPages,
      has_previous_page: parseInt(page) > 1,
      next_page: parseInt(page) < totalPages ? parseInt(page) + 1 : null,
    };

    const result = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_datetime: event.start_datetime,
      status: event.status,
      allow_scan_ticket: event.allow_scan_ticket,
      venue: {
        name: event.venue?.name,
        address: event.venue?.address,
      },
    }));
    return { items: result, paginations };
  }
}
