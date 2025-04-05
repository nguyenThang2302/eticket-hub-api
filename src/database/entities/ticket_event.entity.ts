import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { OrganizationTicket } from './organization_ticket.entity';
import { BaseEntity } from './base.entity';

@Entity('ticket_events')
export class TicketEvent extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.ticketEvents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @ManyToOne(
    () => OrganizationTicket,
    (organizationTicket) => organizationTicket.ticketEvents,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'organization_ticket_id', referencedColumnName: 'id' })
  organizationTicket: OrganizationTicket;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the event',
  })
  event_id: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the organization ticket',
  })
  organization_ticket_id: string;
}
