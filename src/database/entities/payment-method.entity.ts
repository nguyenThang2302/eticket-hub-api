import { Column, Entity } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';

@Entity('payment_methods')
export class PaymentMethod extends SoftDeleteBaseEntity {
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Name of the payment method',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL of the payment method logo',
  })
  logo_url: string;
}
