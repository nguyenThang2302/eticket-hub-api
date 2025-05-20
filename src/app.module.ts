import { Module } from '@nestjs/common';
import { CoreModule } from './shared/modules/core.module';
import { ApiModule } from './api/api.module';
import { SentryInterceptor } from './shared/modules/interceptor/sentry.interceptor';

@Module({
  imports: [CoreModule, ApiModule],
  providers: [SentryInterceptor],
})
export class AppModule {}
