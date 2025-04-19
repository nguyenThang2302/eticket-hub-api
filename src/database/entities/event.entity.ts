import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Organization } from './organization.entity';
import { Venue } from './venue.entity';
import { Language } from './language.entity';
import { TicketEvent } from './ticket_event.entity';
import { Category } from './category.entity';
import { EventSeat } from './event_seat.entity';
import { EventCoupon } from './event_coupon.entity';
import { Order } from './order.entity';

@Entity('events')
export class Event extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Name of the event',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Description of the event',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL of the event logo',
  })
  logo_url: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL of the event poster',
  })
  poster_url: string;

  @Column({
    type: 'datetime',
    nullable: false,
    comment: 'Start date and time of the event',
  })
  start_datetime: Date;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Status of the event',
  })
  status: string;

  @Column({
    default: false,
    type: 'boolean',
    nullable: false,
    comment: 'Flag indicating if the event is active',
  })
  allow_scan_ticket: boolean;

  @ManyToOne(() => Organization, (organization) => organization.events, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id', referencedColumnName: 'id' })
  organization: Organization;

  @ManyToOne(() => Venue, (venue) => venue.events, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'venue_id', referencedColumnName: 'id' })
  venue: Venue;

  @ManyToOne(() => Category, (category) => category.events, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @OneToMany(() => TicketEvent, (ticketEvent) => ticketEvent.event)
  ticketEvents: TicketEvent[];

  @OneToMany(() => EventSeat, (eventSeat) => eventSeat.event)
  eventSeats: EventSeat[];

  @OneToMany(() => EventCoupon, (eventCoupon) => eventCoupon.event)
  eventCoupons: EventCoupon[];

  @OneToMany(() => Order, (order) => order.event)
  orders: Order[];

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
    comment: 'Language code associated with the event',
  })
  lang_code: string;

  @ManyToOne(() => Language, (language) => language.events, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lang_code', referencedColumnName: 'code' })
  language: Language;
}
