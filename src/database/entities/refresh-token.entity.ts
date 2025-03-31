import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { AccessToken, User } from '../entities';
import { BaseEntity } from './base.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column()
  expired_at: Date;

  @ManyToOne(() => User, (user) => user.refresh_token)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_refresh_tokens_users',
  })
  user: User;

  @OneToOne(() => AccessToken, (access_token) => access_token.refresh_token, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'access_token_id',
    foreignKeyConstraintName: 'fk_refresh_tokens_access_tokens',
  })
  @Index('idx_refresh_tokens_access_token_id', { unique: true })
  access_token: AccessToken;
}
