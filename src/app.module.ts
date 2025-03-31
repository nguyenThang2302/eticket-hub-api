import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from './shared/modules/core.module';
import { ApiModule } from './api/api.module';
import { SentryInterceptor } from './shared/modules/interceptor/sentry.interceptor';
import { RequestLoggerMiddleware } from './shared/modules/middleware/request-logger.middleware';
import { LoggerModule } from './shared/modules/logger/logger.module';

@Module({
  imports: [CoreModule, ApiModule, LoggerModule],
  providers: [SentryInterceptor],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
