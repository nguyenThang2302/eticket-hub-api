import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { Language } from './language.entity';

@Entity('organizations')
export class Organization extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Name of the organization',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Description of the organization',
  })
  description: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
    comment: 'Flag indicating if the organization is active',
  })
  is_active: boolean;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Status of the organization',
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL of the organization logo',
  })
  logo_url: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: false,
    comment: 'Language code associated with the organization',
  })
  lang_code: string;

  @ManyToOne(() => Language, (language) => language.organizations, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'lang_code', referencedColumnName: 'code' })
  language: Language;

  @OneToMany(() => Group, (group) => group.organization)
  groups: Group[];
}
