import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/database/entities/seat.entity';
import { Repository } from 'typeorm';
import {
  ListSeatResponseDto,
  ListSeatResponseWrapperDto,
} from './dto/list-seat-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
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
}
