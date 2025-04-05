import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Ticket } from './ticket.entity';
import { TicketEvent } from './ticket_event.entity';
import { BaseEntity } from './base.entity';

@Entity('organization_tickets')
export class OrganizationTicket extends BaseEntity {
  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationTickets,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'organization_id', referencedColumnName: 'id' })
  organization: Organization;

  @ManyToOne(() => Ticket, (ticket) => ticket.organizationTickets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id', referencedColumnName: 'id' })
  ticket: Ticket;

  @OneToMany(() => TicketEvent, (ticketEvent) => ticketEvent.organizationTicket)
  ticketEvents: TicketEvent[];

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the organization',
  })
  organization_id: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the ticket',
  })
  ticket_id: string;
}
