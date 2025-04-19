import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { OrganizeModule } from '../organize/organize.module';
import { UserModule } from '../user/user.module';
import { Group } from 'src/database/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventSeat, Group]),
    OrganizeModule,
    UserModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
