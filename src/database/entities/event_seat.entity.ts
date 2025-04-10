import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Event } from './event.entity';
import { Ticket } from './ticket.entity';

@Entity('event_seats')
export class EventSeat extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the event associated with the seat',
  })
  event_id: string;

  @ManyToOne(() => Event, (event) => event.eventSeats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the ticket associated with the seat',
  })
  ticket_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Row identifier for the seat',
  })
  row: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Label for the seat',
  })
  label: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Type of the seat (e.g., VIP, Regular)',
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Status of the seat (e.g., Available, Booked)',
  })
  status: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.eventSeats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;
}
