import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from 'src/database/entities/seat.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, EventSeat]), EventModule],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}
