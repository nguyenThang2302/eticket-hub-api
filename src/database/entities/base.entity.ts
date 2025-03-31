import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

const PRIMARY_KEY_LENGTH = 16;

/**
 * BaseEntity is an abstract class that provides common fields and functionality
 * for all entities, such as id, created_at, updated_at, created_by, and updated_by.
 */
export abstract class BaseEntity {
  /**
   * Primary key for the entity.
   */
  @PrimaryColumn({ comment: 'Primary key for the entity' })
  id!: string;

  /**
   * Timestamp when the entity was created.
   */
  @CreateDateColumn({ comment: 'Timestamp when the entity was created' })
  created_at!: Date;

  /**
   * Timestamp when the entity was last updated.
   */
  @UpdateDateColumn({ comment: 'Timestamp when the entity was last updated' })
  updated_at!: Date;

  /**
   * Identifier of the user who created this entity.
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Identifier of the user who created this entity',
  })
  created_by!: string;

  /**
   * Identifier of the user who last updated this entity.
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Identifier of the user who last updated this entity',
  })
  updated_by!: string;

  /**
   * Generates a primary id using nanoid before inserting a new record.
   */
  @BeforeInsert()
  protected generatePrimaryId() {
    this.id = nanoid(PRIMARY_KEY_LENGTH);
  }
}
