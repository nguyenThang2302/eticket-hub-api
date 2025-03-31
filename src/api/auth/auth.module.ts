import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { jwtConstants } from '../common/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { LoggerService } from 'src/shared/modules/logger/logger.service';
import { LoggerModule } from 'src/shared/modules/logger/logger.module';
import { AccessToken, RefreshToken } from '../../database/entities';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    TypeOrmModule.forFeature([AccessToken, RefreshToken]),
    UserModule,
    PassportModule,
    MailModule,
    ConfigModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    LoggerService,
  ],
  exports: [AuthService, AuthModule],
})
export class AuthModule {}
