import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Event } from 'src/database/entities/event.entity';
import { Repository } from 'typeorm';
import { EventDetailResponseDto } from './dto/event-detail-response.dto';
import { EventSeat } from 'src/database/entities/event_seat.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
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
}
