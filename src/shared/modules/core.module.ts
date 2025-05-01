import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import databaseConfig from 'src/config/database.config';
import redisConfig from 'src/config/redis.config';
import jwtConfig from 'src/config/jwt.config';
import appConfig from 'src/config/app.config';
import cloudinaryConfig from '../../config/cloudinary.config';
import googleConfig from '../../config/google.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mailerConfig from 'src/config/nestmailer.config';
import bcryptConfig from 'src/config/bcrypt.config';
import mongoConfig from 'src/config/mongo.config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ErrorModule } from './errors/error.module';
import * as path from 'path';
import { LoggerService } from './logger/logger.service';
import { RequestService } from './request/request.service';
import { LoggerModule } from './logger/logger.module';
import { ResponseLoggerInterceptor } from './interceptor/response-logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import paypalConfig from 'src/config/paypal.config';
import * as dayjs from 'dayjs';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import { MongooseModule } from '@nestjs/mongoose';
import('dayjs/locale/vi');

dayjs.extend(localizedFormat);
import sentryConfig from 'src/config/sentry.config';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { SentryInterceptor } from './interceptor/sentry.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        databaseConfig,
        redisConfig,
        jwtConfig,
        appConfig,
        mailerConfig,
        bcryptConfig,
        paypalConfig,
        sentryConfig,
        cloudinaryConfig,
        googleConfig,
        mongoConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.url'),
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        vi: 'vi',
      },
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dsn: configService.get('sentry.sentry_dns'),
        environment: configService.get('sentry.env'),
        enabled: configService.get('sentry.sentry_enabled'),
      }),
    }),
    LoggerModule,
    RedisModule,
    ErrorModule,
  ],

  providers: [
    LoggerService,
    RequestService,
    ResponseLoggerInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLoggerInterceptor,
    },
  ],
})
export class CoreModule {}
