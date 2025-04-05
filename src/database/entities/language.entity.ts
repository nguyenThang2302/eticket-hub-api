import { Column, Entity, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base.entity';
import { Venue } from './venue.entity';
import { Ticket } from './ticket.entity';
import { Event } from './event.entity';

@Entity('languages')
export class Language extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
    unique: true,
    comment: 'Language code (e.g., en, fr, es)',
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Name of the language',
  })
  name: string;

  @OneToMany(() => Organization, (organization) => organization.language)
  organizations: Organization[];

  @OneToMany(() => Venue, (venue) => venue.language)
  venues: Venue[];

  @OneToMany(() => Ticket, (ticket) => ticket.language)
  tickets: Ticket[];

  @OneToMany(() => Event, (event) => event.language)
  events: Event[];
}
