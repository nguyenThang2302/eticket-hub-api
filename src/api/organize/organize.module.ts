import { Module } from '@nestjs/common';
import { OrganizeController } from './organize.controller';
import { OrganizeService } from './organize.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { Group } from 'src/database/entities/group.entity';
import { UserModule } from '../user/user.module';
import { Event } from 'src/database/entities/event.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { TicketEvent } from 'src/database/entities/ticket_event.entity';
import { Venue } from 'src/database/entities/venue.entity';
import { Category } from 'src/database/entities/category.entity';
import { MediaModule } from '../media/media.module';
import { Order } from 'src/database/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Group,
      Event,
      Ticket,
      TicketEvent,
      Venue,
      Category,
      Order,
    ]),
    UserModule,
    MediaModule,
  ],
  controllers: [OrganizeController],
  providers: [OrganizeService],
  exports: [OrganizeService],
})
export class OrganizeModule {}
