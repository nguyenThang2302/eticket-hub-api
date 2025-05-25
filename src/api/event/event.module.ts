import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { EventSeat } from 'src/database/entities/event_seat.entity';
import { OrganizeModule } from '../organize/organize.module';
import { UserModule } from '../user/user.module';
import { Group } from 'src/database/entities/group.entity';
import { Venue } from 'src/database/entities/venue.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { Category } from 'src/database/entities/category.entity';
import { Organization } from 'src/database/entities/organization.entity';
import { TicketEvent } from 'src/database/entities/ticket_event.entity';
import { MediaModule } from '../media/media.module';
import { CacheMiddleware } from 'src/shared/modules/middleware/cache.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventSeat,
      Group,
      Venue,
      Ticket,
      Category,
      Organization,
      TicketEvent,
    ]),
    OrganizeModule,
    UserModule,
    MediaModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CacheMiddleware)
      .forRoutes('events/specials', 'events/trendings');
  }
}
