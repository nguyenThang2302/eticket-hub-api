import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshToken } from '../../../database/entities';
import { Repository } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    protected readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refresh_token_secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const token = await this.refreshTokenRepository.findOneBy({
      id: payload.jti,
    });

    if (!token) throw new UnauthorizedException('INVALID_USER_INFO');

    return payload;
  }
}
