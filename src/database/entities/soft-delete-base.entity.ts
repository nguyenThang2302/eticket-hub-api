import { Column, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class SoftDeleteBaseEntity extends BaseEntity {
  /**
   * Timestamp when the entity was soft deleted.
   */
  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
    comment: 'Timestamp when the entity was soft deleted',
  })
  deleted_at!: Date;

  /**
   * Identifier of the user who deleted this entity.
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Identifier of the user who deleted this entity',
  })
  deleted_by!: string;
}
