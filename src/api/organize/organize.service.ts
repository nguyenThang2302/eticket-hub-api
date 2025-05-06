/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { In, Repository } from 'typeorm';
import { CreateOrganizeDto } from './dto/create-organize.dto';
import {
  EVENT_STATUS,
  REGISTER_ORGANIZATION_STATUS,
} from '../common/constants';
import { Group } from 'src/database/entities/group.entity';
import { Event } from 'src/database/entities/event.entity';
import { UpdateEventRequestDto } from './dto/update-event-organizer.dto';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketEvent } from 'src/database/entities/ticket_event.entity';
import { Venue } from 'src/database/entities/venue.entity';
import { Category } from 'src/database/entities/category.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class OrganizeService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizeRepository: Repository<Organization>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketEvent)
    private readonly ticketEventRepository: Repository<TicketEvent>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService,
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
      .andWhere('event.deleted_at IS NULL')
      .andWhere('event.status = :status', {
        status: EVENT_STATUS.ACTIVE,
      })
      .andWhere('event.end_datetime > NOW()')
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

  async getEventByOrganizer(organizeId: string, eventId: string): Promise<any> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.venue', 'venue')
      .innerJoinAndSelect('event.ticketEvents', 'ticket_event')
      .innerJoinAndSelect('ticket_event.ticket', 'ticket')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .andWhere('ticket.deleted_at IS NULL')
      .select()
      .getOne();
    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }
    const tickets = event.ticketEvents.map((ticketEvent) => ({
      id: ticketEvent.ticket.id,
      name: ticketEvent.ticket.name,
      price: Number(ticketEvent.ticket.price),
      quantity: ticketEvent.ticket.quantity,
      max_quantity: ticketEvent.ticket.max_quantity,
      min_quantity: ticketEvent.ticket.min_quantity,
    }));
    return {
      id: event.id,
      name: event.name,
      poster_url: event.poster_url,
      type: event.type,
      venue: {
        id: event.venue?.id,
        name: event.venue?.name,
        address: event.venue?.address,
      },
      category: {
        id: event.category?.id,
        name: event.category?.name,
      },
      description: event.description,
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      tickets,
      privacy: event.privacy,
      banks: {
        name: event.bank,
        account_number: event.account_number,
        account_name: event.account_owner,
      },
      business: {
        type: event.business_type,
        full_name: event.full_name,
        address: event.address_business,
        tax_code: event.tax_code,
      },
    };
  }

  async updateEventByOrganizer(
    organizeId: string,
    eventId: string,
    data: UpdateEventRequestDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .innerJoinAndSelect('event.ticketEvents', 'ticket_event')
      .innerJoinAndSelect('event.venue', 'venue')
      .innerJoinAndSelect('ticket_event.ticket', 'ticket')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.id = :eventId', { eventId })
      .select()
      .getOne();
    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: data.category },
    });
    if (!category) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    if (file) {
      await this.mediaService.uploadEventImage(file, event.id);
    }

    if (event.ticketEvents.length > 0) {
      const tickets = event.ticketEvents.map((ticketEvent) => ({
        id: ticketEvent.ticket.id,
        name: ticketEvent.ticket.name,
        price: Number(ticketEvent.ticket.price),
        quantity: ticketEvent.ticket.quantity,
        max_quantity: ticketEvent.ticket.max_quantity,
        min_quantity: ticketEvent.ticket.min_quantity,
      }));
      const ticketIds = tickets.map((ticket) => ticket.id);
      await this.ticketEventRepository.delete({
        event_id: eventId,
        ticket_id: In(ticketIds),
      });
      await this.ticketRepository.softDelete({
        id: In(ticketIds),
      });
    }
    data.tickets.forEach(async (ticket) => {
      const createTicket = this.ticketRepository.create({
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        max_quantity: ticket.max_quantity,
        min_quantity: ticket.min_quantity,
      });
      await this.ticketRepository.save(createTicket);
      const createTicketEvent = this.ticketEventRepository.create({
        event: event,
        ticket: createTicket,
      });
      await this.ticketEventRepository.save(createTicketEvent);
    });

    const venueId = event.venue.id;
    const updateVenue = {
      name: data.address.name,
      address: `${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.city}`,
    };
    await this.venueRepository.update(venueId, updateVenue);
    const updatedEvent = {
      name: data.name,
      type: data.type,
      category: { id: data.category },
      description: data.description,
      start_datetime: data.start_datetime,
      end_datetime: data.end_datetime,
      privacy: data.privacy,
      account_owner: data.account_owner,
      account_number: data.account_number,
      bank: data.bank,
      business_type: data.business_type,
      full_name: data.full_name,
      address_business: data.address_business,
      tax_code: data.tax_code,
    };
    await this.eventRepository.update(eventId, updatedEvent);

    return {
      id: eventId,
    };
  }
}
