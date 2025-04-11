import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('payment_orders')
export class PaymentOrder extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.payment_orders)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the order associated with the payment order',
  })
  order_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Identifier for the payment order',
  })
  payment_order_id: string;
}
