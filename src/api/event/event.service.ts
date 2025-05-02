import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Event } from 'src/database/entities/event.entity';
import { Repository } from 'typeorm';
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
      where: { id: eventId },
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

    return { items: eventSeats };
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
    const totalEvents = await this.eventRepository.countBy({
      category: {
        name: params.cate,
      },
    });

    const { cate, page = 1, limit = 4 } = params;
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.category', 'category')
      .innerJoinAndSelect('event.ticketEvents', 'ticketEvent')
      .innerJoinAndSelect('ticketEvent.ticket', 'ticket')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('category.name = :categoryName', { categoryName: cate })
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
    return {
      items: events.map((event) => ({
        id: event.id,
        name: event.name,
        start_time: event.start_datetime,
        logo_url: event.logo_url,
        price: this.calculateLowestTicketPrice(event),
        venue: event.venue.name,
      })),
      paginations: paginations,
    };
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
    const { page = 1, limit = 4 } = params;
    const currentPage = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    const totalEvents = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoin('event.organization', 'organization')
      .where('organization.id = :organizeId', { organizeId })
      .andWhere('event.status = :status', { status: EVENT_STATUS.IN_REVIEW })
      .getCount();

    const totalPages = Math.ceil(totalEvents / pageSize);
    const offset = (currentPage - 1) * pageSize;

    const events = await this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.organization', 'organization')
      .innerJoinAndSelect('event.venue', 'venue')
      .where('organization.id = :organizeId', { organizeId })
      .andWhere('event.status = :status', { status: EVENT_STATUS.IN_REVIEW })
      .orderBy('event.created_at', 'DESC')
      .skip(offset)
      .take(pageSize)
      .getMany();

    const items = events.map((event) => ({
      id: event.id,
      name: event.name,
      start_time: event.start_datetime,
      poster_url: event.poster_url,
      venue: {
        name: event.venue.name,
        address: event.venue.address,
      },
    }));

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
}
