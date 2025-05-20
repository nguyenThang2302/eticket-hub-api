import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import DailyRotateFile = require('winston-daily-rotate-file');

import { LoggerFormat } from './logger.format';
import { LoggerService } from './logger.service';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { ResponseLoggerInterceptor } from './interceptor/response-logger.interceptor';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }

  static register(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transports: [
              new DailyRotateFile({
                dirname: configService.get('LOG_DIR'),
                filename: configService.get('LOG_FILE_NAME'),
                maxFiles: configService.get('LOG_FILE_MAX'),
                format: LoggerFormat.getRotateFileFormat(),
              }),
            ],
          }),
        }),
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseLoggerInterceptor,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
