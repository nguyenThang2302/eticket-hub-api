import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';
import { Coupon } from './coupon.entity';
import { BaseEntity } from './base.entity';

@Entity('event_coupons')
export class EventCoupon extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.eventCoupons, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @ManyToOne(() => Coupon, (coupon) => coupon.eventCoupons, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'coupon_id', referencedColumnName: 'id' })
  coupon: Coupon;
}
