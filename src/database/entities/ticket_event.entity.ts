import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';
import { BaseEntity } from './base.entity';

@Entity('ticket_events')
export class TicketEvent extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.ticketEvents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the event',
  })
  event_id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the ticket',
  })
  ticket_id: string;
}
