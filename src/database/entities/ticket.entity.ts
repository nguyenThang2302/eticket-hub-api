import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Language } from './language.entity';
import { TicketEvent } from './ticket_event.entity';
import { EventSeat } from './event_seat.entity';

@Entity('tickets')
export class Ticket extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Name of the ticket',
  })
  name: string;

  @Column({
    type: 'bigint',
    nullable: false,
    comment: 'Price of the ticket',
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
    comment: 'Quantity of tickets available',
  })
  quantity: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
    comment: 'Minimum quantity of tickets that can be purchased',
  })
  min_quantity: number;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
    comment: 'Maximum quantity of tickets that can be purchased',
  })
  max_quantity: number;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
    comment: 'Language code associated with the ticket',
  })
  lang_code: string;

  @ManyToOne(() => Language, (language) => language.tickets, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lang_code', referencedColumnName: 'code' })
  language: Language;

  @OneToMany(() => TicketEvent, (ticketEvent) => ticketEvent.ticket, {
    cascade: true,
  })
  ticketEvents: TicketEvent[];

  @OneToMany(() => EventSeat, (eventSeat) => eventSeat.ticket, {
    cascade: true,
  })
  eventSeats: EventSeat[];
}
