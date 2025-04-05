import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Language } from './language.entity';
import { Event } from './event.entity';

@Entity('venues')
export class Venue extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Name of the venue',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Address of the venue',
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Description of the venue',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
    comment: 'Language code associated with the venue',
  })
  lang_code: string;

  @ManyToOne(() => Language, (language) => language.venues, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lang_code', referencedColumnName: 'code' })
  language: Language;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];
}
