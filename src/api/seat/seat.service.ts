import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/database/entities/seat.entity';
import { Repository } from 'typeorm';
import {
  ListSeatResponseDto,
  ListSeatResponseWrapperDto,
} from './dto/list-seat-response.dto';
import { plainToInstance } from 'class-transformer';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { EventService } from '../event/event.service';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(EventSeat)
    private readonly eventSeatRepository: Repository<EventSeat>,
    private readonly eventService: EventService,
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

  async createSeat(body: CreateSeatDto) {
    const { event_id } = body;
    const isExistingEvent = await this.eventService.getEventDetails(event_id);
    if (!isExistingEvent) {
      throw new Error('EVENT_NOT_FOUND');
    }
    const eventSeat = this.eventSeatRepository.create(body);
    const eventSeatSaved = await this.eventSeatRepository.save(eventSeat);
    return {
      id: eventSeatSaved[0].id,
    };
  }

  async isValidSeat(seats: any): Promise<boolean> {
    for (const seat of seats) {
      const { id, status, type } = seat;
      const existingSeat = await this.eventSeatRepository
        .createQueryBuilder('event_seat')
        .where('event_seat.id = :id', { id })
        .andWhere('event_seat.status = :status', { status })
        .andWhere('event_seat.type = :type', { type })
        .getOne();

      if (!existingSeat) {
        return false;
      }
    }
    return true;
  }
}
