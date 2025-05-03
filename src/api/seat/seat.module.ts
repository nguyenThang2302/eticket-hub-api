import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from 'src/database/entities/seat.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { EventModule } from '../event/event.module';
import { Group } from 'src/database/entities/group.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { Event } from 'src/database/entities/event.entity';
import { OrganizeModule } from '../organize/organize.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seat, EventSeat, Ticket, Group, Event]),
    EventModule,
    OrganizeModule,
    UserModule,
  ],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}
