import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';
import { EventCoupon } from './event_coupon.entity';

@Entity('coupons')
export class Coupon extends SoftDeleteBaseEntity {
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
    type: 'int',
    nullable: true,
    comment: 'Discount amount of the coupon',
  })
  amount: number;

  @OneToMany(() => EventCoupon, (eventCoupon) => eventCoupon.coupon)
  eventCoupons: EventCoupon[];
}
