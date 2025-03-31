import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User, RefreshToken } from '../entities';
import { BaseEntity } from './base.entity';

@Entity('access_tokens')
export class AccessToken extends BaseEntity {
  @Column()
  expired_at: Date;

  @ManyToOne(() => User, (user) => user.access_tokens)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_access_tokens_users',
  })
  user: User;

  @OneToOne(() => RefreshToken, (refresh_token) => refresh_token.access_token)
  refresh_token: RefreshToken;
}
