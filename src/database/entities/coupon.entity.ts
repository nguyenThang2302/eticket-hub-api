import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { EventCoupon } from './event_coupon.entity';
import { Order } from './order.entity';

@Entity('coupons')
export class Coupon extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Name of the campaign associated with the coupon',
  })
  campaign_name: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'Type of the coupon',
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    comment: 'Unique code for the coupon',
  })
  code: string;

  @Column({
    type: 'double',
    nullable: true,
    comment: 'Discount percentage of the coupon',
  })
  percent: number;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'Start date of the coupon validity',
  })
  start_datetime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'End date of the coupon validity',
  })
  end_datetime: Date;

  @OneToMany(() => EventCoupon, (eventCoupon) => eventCoupon.coupon)
  eventCoupons: EventCoupon[];

  @OneToMany(() => Order, (order) => order.coupon)
  orders: Order[];
}
