import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the user associated with the group',
  })
  user_id: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: false,
    comment: 'Identifier of the organization associated with the group',
  })
  organization_id: string;

  @ManyToOne(() => User, (user) => user.groups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_groups_users' })
  user: User;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    comment: 'Flag indicating if the user is the owner of the organization',
  })
  is_owner: boolean;

  @ManyToOne(() => Organization, (organization) => organization.groups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'organization_id',
    foreignKeyConstraintName: 'fk_groups_organizations',
  })
  organization: Organization;
}
