import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Event } from './event.entity';

@Entity('event_seats')
export class EventSeat extends SoftDeleteBaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 16,
    comment: 'Unique identifier for the event seat',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the event associated with the seat',
  })
  event_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Name of the event seat',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Seat map data for the event',
  })
  seat_map_data: string;

  @ManyToOne(() => Event, (event) => event.eventSeats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;
}
