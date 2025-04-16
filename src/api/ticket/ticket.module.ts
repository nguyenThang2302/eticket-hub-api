import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/database/entities/ticket.entity';
import { OrganizeModule } from '../organize/organize.module';
import { UserModule } from '../user/user.module';
import { Group } from 'src/database/entities/group.entity';
import { Event } from 'src/database/entities/event.entity';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Group, Event, OrderTicketImage]),
    OrganizeModule,
    UserModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
