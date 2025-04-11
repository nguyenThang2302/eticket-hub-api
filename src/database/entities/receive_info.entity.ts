import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('receive_infos')
export class ReceiveInfo extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @OneToMany(() => Order, (order) => order.receive_info)
  orders: Order[];
}
