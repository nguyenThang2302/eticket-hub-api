import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SoftDeleteBaseEntity } from './soft-delete-base.entity';

@Entity('seats')
export class Seat extends SoftDeleteBaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 16,
    comment: 'Unique identifier for the seat',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Row identifier for the seat',
  })
  row: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Label for the seat',
  })
  label: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Type of the seat (e.g., VIP, Regular)',
  })
  type: string;
}
