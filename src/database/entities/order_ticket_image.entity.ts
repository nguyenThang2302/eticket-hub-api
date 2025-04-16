import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('order_ticket_images')
export class OrderTicketImage extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.order_ticket_images, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment:
      'Foreign key referencing the order associated with the ticket image',
  })
  order_id: string;

  @Column({
    type: 'varchar',
    length: 16,
    nullable: true,
    comment: 'Unique code for the ticket image',
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Name of the ticket',
  })
  ticket_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Location of the seat associated with the ticket',
  })
  seat_location: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL of the QR code for the ticket',
  })
  qr_ticket_url: string;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: 'Price of the ticket',
  })
  price: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indicates if the ticket is used',
  })
  is_scanned: boolean;
}
