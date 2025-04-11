import { AccessToken, RefreshToken } from '../entities';
import { PROVIDER, ROLE, SEX } from 'src/api/common/constants';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Group } from './group.entity';
import { Order } from './order.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'nvarchar' })
  name: string;

  @Column()
  avatar_url: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({
    type: 'enum',
    enum: ['google', 'facebook', 'local'],
    default: 'local',
  })
  provider: PROVIDER;

  @Column({
    type: 'enum',
    nullable: true,
    enum: ['male', 'female'],
    comment: 'Sex of the user (male, female)',
    default: null,
  })
  sex: SEX;

  @Column({
    type: 'date',
    nullable: true,
    default: null,
    comment: 'Date of birth of the user',
  })
  date_of_birth: Date;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    default: null,
    comment: 'Phone number of the user',
  })
  phone_number: string;

  @OneToMany(() => AccessToken, (access_token) => access_token.user)
  access_tokens: AccessToken[];

  @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
  refresh_token: RefreshToken[];

  @OneToMany(() => Group, (group) => group.user)
  groups: Group[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
