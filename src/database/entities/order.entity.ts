import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ReceiveInfo } from './receive_info.entity';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { PaymentMethod } from './payment-method.entity';
import { Event } from './event.entity';
import { Coupon } from './coupon.entity';
import { PaymentOrder } from './payment_order.entity';
import { OrderTicketImage } from './order_ticket_image.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.orders)
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;
  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the event associated with the seat',
  })
  event_id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the user associated with the order',
  })
  user_id: string;

  @ManyToOne(() => PaymentMethod, (payment_method) => payment_method.orders)
  @JoinColumn({ name: 'payment_method_id', referencedColumnName: 'id' })
  paymet_method: PaymentMethod;
  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the payment method associated with the order',
  })
  payment_method_id: string;

  @ManyToOne(() => ReceiveInfo, (receive_info) => receive_info.orders)
  @JoinColumn({ name: 'receive_info_id', referencedColumnName: 'id' })
  receive_info: ReceiveInfo;
  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the receive info associated with the order',
  })
  receive_info_id: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders)
  @JoinColumn({ name: 'coupon_id', referencedColumnName: 'id' })
  coupon: Coupon;
  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Identifier of the coupon associated with the order',
  })
  coupon_id: string;

  @Column({ type: 'double', nullable: true })
  discount_price: number;

  @Column({ type: 'double', nullable: true })
  sub_total_price: number;

  @Column({ type: 'double', nullable: true })
  total_price: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  seat_info: string;

  @OneToMany(() => PaymentOrder, (payment_order) => payment_order.order)
  payment_orders: PaymentOrder[];

  @OneToMany(
    () => OrderTicketImage,
    (order_ticket_image) => order_ticket_image.order,
  )
  order_ticket_images: OrderTicketImage[];
}
