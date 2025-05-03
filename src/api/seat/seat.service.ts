import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/database/entities/seat.entity';
import { In, Repository } from 'typeorm';
import {
  ListSeatResponseDto,
  ListSeatResponseWrapperDto,
} from './dto/list-seat-response.dto';
import { plainToInstance } from 'class-transformer';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { EventService } from '../event/event.service';
import { Ticket } from 'src/database/entities/ticket.entity';
import { CreateSeatMapDto } from './dto/create-seat-map.dto';
import { Event } from 'src/database/entities/event.entity';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
    private readonly eventService: EventService,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async getSeats(): Promise<ListSeatResponseWrapperDto> {
    const seats = await this.seatRepository
      .createQueryBuilder('seat')
      .orderBy('seat.row', 'ASC')
      .addOrderBy(
        `
    CASE
      WHEN seat.label = '0' THEN 11.5
      ELSE CAST(seat.label AS UNSIGNED)
    END
  `,
        'ASC',
      )
      .getMany();

    const items = plainToInstance(ListSeatResponseDto, seats, {
      excludeExtraneousValues: true,
    });

    return plainToInstance(
      ListSeatResponseWrapperDto,
      { items },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async isValidSeat(seats: any): Promise<boolean> {
    for (const seat of seats) {
      const { id, type } = seat;
      const existingSeat = await this.eventSeatRepository
        .createQueryBuilder('event_seat')
        .where('event_seat.id = :id', { id })
        .andWhere('event_seat.type = :type', { type })
        .getOne();

      if (!existingSeat) {
        return false;
      }
    }
    return true;
  }

  async createSeats(body: CreateSeatDto, eventId: string) {
    const { seats } = body;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('EVENT_NOT_FOUND');
    }

    const tickets = await this.getUniqueTickets(seats);
    const ticketIds = tickets.map((ticket) => ticket.id);
    for (const ticket of tickets) {
      const ticketExists = await this.ticketRepository.findOne({
        where: { id: ticket.id },
      });
      if (!ticketExists) {
        throw new NotFoundException('TICKET_NOT_FOUND');
      }
    }
    const eventSeats = await this.eventSeatRepository.find({
      where: {
        event_id: eventId,
        ticket_id: In(ticketIds),
      },
    });
    if (eventSeats.length > 0) {
      await this.eventSeatRepository.remove(eventSeats);
    }
    for (const seat of seats) {
      const createSeatTicket = this.eventSeatRepository.create({
        event_id: eventId,
        ticket_id: seat.ticket.id,
        row: seat.row,
        label: seat.label,
        type: seat.type,
        status: seat.status,
        background_color: seat.ticket.backgroundColor,
      });
      await this.eventSeatRepository.save(createSeatTicket);
    }
    return {
      message: 'Created successfully',
    };
  }

  async createSeatsMap(body: CreateSeatMapDto, eventId: string) {
    const { data } = body;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('EVENT_NOT_FOUND');
    }

    await this.eventRepository.update(eventId, {
      seats: data,
    });

    return {
      id: event.id,
    };
  }

  async getSeatMapInitials(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('EVENT_NOT_FOUND');
    }

    return event.seats;
  }

  private async getUniqueTickets(seats: any[]) {
    const uniqueTicketsMap = new Map();

    for (const seat of seats) {
      const ticket = seat.ticket;
      if (!uniqueTicketsMap.has(ticket.id)) {
        uniqueTicketsMap.set(ticket.id, ticket);
      }
    }

    return Array.from(uniqueTicketsMap.values());
  }
}
