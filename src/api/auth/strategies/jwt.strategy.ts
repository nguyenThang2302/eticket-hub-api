import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from '../../../database/entities';
import { Repository } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    protected readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.access_token_secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const token = await this.accessTokenRepository.findOneBy({
      id: payload.jti,
    });

    if (!token) throw new UnauthorizedException('AUTH-0504');

    return payload;
  }
}
