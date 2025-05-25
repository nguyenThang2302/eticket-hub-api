import * as _ from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Event } from 'src/database/entities/event.entity';
import { Brackets, In, MoreThan, Repository } from 'typeorm';
import { EventDetailResponseDto } from './dto/event-detail-response.dto';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { Venue } from 'src/database/entities/venue.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { EVENT_STATUS } from '../common/constants';
import { Category } from 'src/database/entities/category.entity';
import { Organization } from 'src/database/entities/organization.entity';
import { TicketEvent } from 'src/database/entities/ticket_event.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(TicketEvent)
    private readonly ticketEventRepository: Repository<TicketEvent>,
    private readonly mediaService: MediaService,
  ) {}

  async getEventDetails(eventId: string): Promise<EventDetailResponseDto> {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
        status: EVENT_STATUS.ACTIVE,
        end_datetime: MoreThan(new Date()),
      },
      relations: [
        'ticketEvents',
        'ticketEvents.ticket',
        'organization',
        'venue',
      ],
    });

    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }

    const response = {
      id: event.id,
      name: event.name,
      start_time: event.start_datetime.toISOString(),
      venue: event.venue
        ? {
            name: event.venue.name,
            address: event.venue.address,
          }
        : null,
      poster_url: event.poster_url,
      description: event.description,
      price: this.calculateLowestTicketPrice(event),
      tickets:
        event.ticketEvents?.map((ticketEvent) => ({
          name: ticketEvent.ticket.name,
          price: ticketEvent.ticket.price.toString(),
        })) || [],
      organize: event.organization
        ? {
            id: event.organization.id,
            name: event.organization.name,
            description: event.organization.description,
            logo_url: event.organization.logo_url,
          }
        : null,
    };

    return plainToInstance(EventDetailResponseDto, response);
  }

  private calculateLowestTicketPrice(event: Event): string {
    const prices = event.ticketEvents?.map(
      (ticketEvent) => ticketEvent.ticket.price,
    );
    if (!prices || prices.length === 0) {
      return '0';
    }
    return Math.min(...prices).toString();
  }

  async isExistingEvent(eventId: string): Promise<boolean> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    return !!event;
  }

  async getEventSeats(eventId: string): Promise<any> {
    const isExistingEvent = await this.isExistingEvent(eventId);
    if (!isExistingEvent) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }

    const eventSeats = await this.eventSeatRepository
      .createQueryBuilder('eventSeat')
      .leftJoinAndSelect('eventSeat.ticket', 'ticket')
      .leftJoin('eventSeat.event', 'event')
      .select([
        'eventSeat.id',
        'eventSeat.row',
        'eventSeat.label',
        'eventSeat.type',
        'eventSeat.status',
        'eventSeat.background_color',
        'ticket.id',
        'ticket.price',
        'ticket.name',
      ])
      .where('eventSeat.event_id = :eventId', { eventId })
      .orderBy('eventSeat.row', 'ASC')
      .addOrderBy(
        `
        CASE 
          WHEN eventSeat.label = '0' THEN 11.5
          ELSE CAST(eventSeat.label AS UNSIGNED)
        END
      `,
        'ASC',
      )
      .getMany();

    const items = eventSeats.map((eventSeat) => ({
      id: eventSeat.id,
      row: eventSeat.row,
      label: eventSeat.label,
      type: eventSeat.type,
      status: eventSeat.status,
      ticket: {
        id: eventSeat.ticket.id,
        price: eventSeat.ticket.price.toString(),
        name: eventSeat.ticket.name,
        background_color: eventSeat.background_color,
      },
    }));

    return { items: items };
  }

  async changeStatusScan(eventId: string): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('EVENT_NOT_FOUND');
    }

    event.allow_scan_ticket = !event.allow_scan_ticket;
    await this.eventRepository.save(event);

    return { id: event.id, allow_scan_ticket: event.allow_scan_ticket };
  }

  async searchEvents(params: any): Promise<any> {
    const {
      q = null,
      cate,
      start_date: startDate,
      end_date: endDate,
      local,
      is_free: isFreeString,
      page = 1,
      limit = 4,
    } = params;

    const cateParams = cate ? cate.split(',') : null;
    const isFree = isFreeString === 'true';

    const cates = await this.categoryRepository.find({
      select: ['name'],
      where: { lang_code: 'en' },
    });

    const categoryNames = cateParams || cates.map((cate) => cate.name);

    const categories = await this.categoryRepository.find({
      where: { name: In(categoryNames) },
    });
    const categoryIds = categories.map((category) => category.id);

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.ticketEvents', 'ticketEvent')
      .innerJoinAndSelect('ticketEvent.ticket', 'ticket')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    if (q) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.description LIKE :q', { q: `%${q}%` })
            .orWhere('category.name LIKE :q', { q: `%${q}%` })
            .orWhere('ticket.name LIKE :q', { q: `%${q}%` })
            .orWhere('venue.name LIKE :q', { q: `%${q}%` });
        }),
      );
    }

    if (startDate) {
      queryBuilder.andWhere('event.start_datetime >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      queryBuilder.andWhere('event.end_datetime <= :endDate', { endDate });
    }

    if (isFree) {
      queryBuilder.andWhere('ticket.price = 0');
    }

    if (local && local !== 'Other locations') {
      queryBuilder.andWhere(
        'SUBSTRING_INDEX(SUBSTRING_INDEX(venue.address, ",", 4), ",", -1) LIKE :local',
        { local: `%${local}%` },
      );
    }

    queryBuilder
      .limit(parseInt(limit))
      .offset(parseInt(limit) * (parseInt(page) - 1));

    const events = await queryBuilder.getMany();
    const totalEvents = await queryBuilder.getCount();

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

    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      logo_url: event.logo_url || event.poster_url,
      price: this.calculateLowestTicketPrice(event),
      venue: event.venue.name,
    }));

    return { items, paginations };
  }

  async createEvent(
    organizeId: string,
    body: CreateEventRequestDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const venue = {
      name: body.address.name,
      city: body.address.city,
      district: body.address.district,
      ward: body.address.ward,
      street: body.address.street,
    };
    const tickets = body.tickets;
    const venueSaved = new Venue();
    venueSaved.name = venue.name;
    venueSaved.address = `${venue.street}, ${venue.ward}, ${venue.district}, ${venue.city}`;
    venueSaved.lang_code = 'en';
    const venueCreated = await this.venueRepository.save(venueSaved);

    const existingCategory = await this.categoryRepository.findOne({
      where: { id: body.category },
    });
    if (!existingCategory) {
      throw new BadRequestException('CATEGORY_NOT_FOUND');
    }

    const existingOrganizer = await this.organizationRepository.findOne({
      where: { id: organizeId },
    });
    if (!existingOrganizer) {
      throw new BadRequestException('ORGANIZER_NOT_FOUND');
    }

    const savedTickets = [];
    for (const ticket of tickets) {
      const ticketEntity = new Ticket();
      ticketEntity.name = ticket.name;
      ticketEntity.price = ticket.price;
      ticketEntity.quantity = ticket.quantity;
      ticketEntity.min_quantity = ticket.min_quantity;
      ticketEntity.max_quantity = ticket.max_quantity;
      ticketEntity.lang_code = 'en';
      ticketEntity.created_at = new Date();
      ticketEntity.updated_at = new Date();

      const savedTicket = await this.ticketRepository.save(ticketEntity);
      savedTickets.push(savedTicket);
    }

    const event = new Event();
    event.name = body.name;
    event.organization = existingOrganizer;
    event.category = existingCategory;
    event.venue = venueCreated;
    event.lang_code = 'en';
    event.name = body.name;
    event.description = body.description;
    event.type = body.type;
    event.start_datetime = new Date(body.start_datetime);
    event.end_datetime = new Date(body.end_datetime);
    event.privacy = body.privacy;
    event.status = EVENT_STATUS.IN_REVIEW;
    event.account_owner = body.account_owner;
    event.account_number = body.account_number;
    event.bank = body.bank;
    event.business_type = body.business_type;
    event.full_name = body.full_name;
    event.address_business = body.address_business;
    event.tax_code = body.tax_code;
    event.created_at = new Date();
    event.updated_at = new Date();
    const eventSaved = await this.eventRepository.save(event);

    await this.mediaService.uploadEventImage(file, eventSaved.id);

    for (const savedTicket of savedTickets) {
      const ticketEvent = new TicketEvent();
      ticketEvent.ticket = savedTicket;
      ticketEvent.event = eventSaved;
      await this.ticketEventRepository.save(ticketEvent);
    }

    return {
      id: eventSaved.id,
    };
  }

  async getPendingEvents(organizeId: string, params: any): Promise<any> {
    const { page = 1, limit = 4, q } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    // Build the base query
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.organization', 'organization')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('organization.id = :organizeId', { organizeId })
      .andWhere('event.status = :status', { status: EVENT_STATUS.IN_REVIEW });

    if (q) {
      // Add search functionality
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.description LIKE :q', { q: `%${q}%` })
            .orWhere('organization.name LIKE :q', { q: `%${q}%` })
            .orWhere('venue.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.id LIKE :q', { q: `%${q}%` });
        }),
      );
    }

    // Get total count
    const totalEvents = await queryBuilder.getCount();

    // Apply pagination and sorting
    const events = await queryBuilder
      .orderBy('event.created_at', 'DESC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // Map events to response format
    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      end_time: event.end_datetime,
      poster_url: event.poster_url,
      venue: {
        name: event.venue.name,
        address: event.venue.address,
      },
    }));

    // Calculate pagination details
    const totalPages = Math.ceil(totalEvents / pageSize);
    const paginations = {
      total: totalEvents,
      limit: pageSize,
      page: currentPage,
      current_page: currentPage,
      total_page: totalPages,
      has_next_page: currentPage < totalPages,
      has_previous_page: currentPage > 1,
      next_page: currentPage < totalPages ? currentPage + 1 : null,
    };

    return { items, paginations };
  }

  async getUpcomingEvents(organizeId: string, params: any): Promise<any> {
    const { page = 1, limit = 4, q } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    // Build the base query
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.organization', 'organization')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('organization.id = :organizeId', { organizeId })
      .andWhere('event.end_datetime > NOW()')
      .andWhere(
        new Brackets((qb) => {
          qb.where('event.status = :activeStatus', {
            activeStatus: EVENT_STATUS.ACTIVE,
          })
            .orWhere('event.status = :approvedStatus', {
              approvedStatus: EVENT_STATUS.APPROVED,
            })
            .orWhere('event.status = :inReviewStatus', {
              inReviewStatus: EVENT_STATUS.INACTIVE,
            });
        }),
      );

    if (q) {
      // Add search functionality
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.description LIKE :q', { q: `%${q}%` })
            .orWhere('organization.name LIKE :q', { q: `%${q}%` })
            .orWhere('venue.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.id LIKE :q', { q: `%${q}%` });
        }),
      );
    }
    // Get total count
    const totalEvents = await queryBuilder.getCount();

    // Apply pagination and sorting
    const events = await queryBuilder
      .orderBy('event.start_datetime', 'ASC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // Map events to response format
    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      end_time: event.end_datetime,
      poster_url: event.poster_url,
      status: event.status,
      venue: {
        name: event.venue.name,
        address: event.venue.address,
      },
    }));

    // Calculate pagination details
    const totalPages = Math.ceil(totalEvents / pageSize);
    const paginations = {
      total: totalEvents,
      limit: pageSize,
      page: currentPage,
      current_page: currentPage,
      total_page: totalPages,
      has_next_page: currentPage < totalPages,
      has_previous_page: currentPage > 1,
      next_page: currentPage < totalPages ? currentPage + 1 : null,
    };

    return { items, paginations };
  }

  async getPastEvents(organizeId: string, params: any): Promise<any> {
    const { page = 1, limit = 4, q } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    // Build the base query
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.organization', 'organization')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.end_datetime < NOW()')
      .andWhere('event.status = :status', { status: EVENT_STATUS.ACTIVE });

    if (q) {
      // Add search functionality
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.description LIKE :q', { q: `%${q}%` })
            .orWhere('organization.name LIKE :q', { q: `%${q}%` })
            .orWhere('venue.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.id LIKE :q', { q: `%${q}%` });
        }),
      );
    }

    // Get total count
    const totalEvents = await queryBuilder.getCount();

    // Apply pagination and sorting
    const events = await queryBuilder
      .orderBy('event.start_datetime', 'ASC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // Map events to response format
    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      end_time: event.end_datetime,
      status: event.status,
      poster_url: event.poster_url,
      venue: {
        name: event.venue.name,
        address: event.venue.address,
      },
    }));

    // Calculate pagination details
    const totalPages = Math.ceil(totalEvents / pageSize);
    const paginations = {
      total: totalEvents,
      limit: pageSize,
      page: currentPage,
      current_page: currentPage,
      total_page: totalPages,
      has_next_page: currentPage < totalPages,
      has_previous_page: currentPage > 1,
      next_page: currentPage < totalPages ? currentPage + 1 : null,
    };

    return { items, paginations };
  }

  async getRejectedEvents(organizeId: string, params: any): Promise<any> {
    const { page = 1, limit = 4, q } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    // Build the base query
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.organization', 'organization')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('event.organization_id = :organizeId', { organizeId })
      .andWhere('event.status = :status', { status: EVENT_STATUS.REJECTED });

    if (q) {
      // Add search functionality
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('event.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.description LIKE :q', { q: `%${q}%` })
            .orWhere('organization.name LIKE :q', { q: `%${q}%` })
            .orWhere('venue.name LIKE :q', { q: `%${q}%` })
            .orWhere('event.id LIKE :q', { q: `%${q}%` });
        }),
      );
    }

    // Get total count
    const totalEvents = await queryBuilder.getCount();

    // Apply pagination and sorting
    const events = await queryBuilder
      .orderBy('event.start_datetime', 'ASC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // Map events to response format
    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      end_time: event.end_datetime,
      status: event.status,
      poster_url: event.poster_url,
      venue: {
        name: event.venue.name,
        address: event.venue.address,
      },
    }));

    // Calculate pagination details
    const totalPages = Math.ceil(totalEvents / pageSize);
    const paginations = {
      total: totalEvents,
      limit: pageSize,
      page: currentPage,
      current_page: currentPage,
      total_page: totalPages,
      has_next_page: currentPage < totalPages,
      has_previous_page: currentPage > 1,
      next_page: currentPage < totalPages ? currentPage + 1 : null,
    };

    return { items, paginations };
  }

  async getSpecialEvents() {
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.status = :status', { status: EVENT_STATUS.ACTIVE })
      .orderBy('event.start_datetime', 'DESC')
      .take(13)
      .getMany();

    return {
      items: events.map((event) => ({
        id: event.id,
        name: event.name,
        poster_url: event.poster_url,
      })),
    };
  }

  async getTrendingEvents() {
    const eventTrendings = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.orders', 'order')
      .select('event.id', 'id')
      .addSelect('event.name', 'name')
      .addSelect('event.poster_url', 'poster_url')
      .addSelect('event.start_datetime', 'start_datetime')
      .addSelect('COUNT(order.id)', 'orderCount')
      .where('event.status = :status', { status: EVENT_STATUS.ACTIVE })
      .groupBy('event.id')
      .addGroupBy('event.name')
      .addGroupBy('event.start_datetime')
      .orderBy('orderCount', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      items: eventTrendings.map((event) => ({
        id: event.id,
        name: event.name,
        poster_url: event.poster_url,
      })),
    };
  }
}
