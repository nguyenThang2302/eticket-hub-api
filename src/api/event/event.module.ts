import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventSeat])],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
