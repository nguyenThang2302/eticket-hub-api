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
        'ticketEvents.organizationTicket',
        'ticketEvents.organizationTicket.ticket',
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
          name: ticketEvent.organizationTicket.ticket.name,
          price: ticketEvent.organizationTicket.ticket.price.toString(),
        })) || [],
      organize: event.organization
        ? {
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
      (ticketEvent) => ticketEvent.organizationTicket.ticket.price,
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

    const eventSeat = await this.eventSeatRepository.findOneBy({
      event_id: eventId,
    });

    return {
      id: eventSeat.event_id,
      name: eventSeat.name,
      seat_map_data: eventSeat.seat_map_data,
    };
  }
}
