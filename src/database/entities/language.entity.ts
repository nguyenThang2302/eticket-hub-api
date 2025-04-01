import { Column, Entity, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base.entity';

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
}
