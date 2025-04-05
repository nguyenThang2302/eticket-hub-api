import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Language } from './language.entity';
import { OrganizationTicket } from './organization_ticket.entity';

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
    comment: 'Amount of tickets available',
  })
  amount: number;

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

  @OneToMany(
    () => OrganizationTicket,
    (organizationTicket) => organizationTicket.ticket,
  )
  organizationTickets: OrganizationTicket[];
}
