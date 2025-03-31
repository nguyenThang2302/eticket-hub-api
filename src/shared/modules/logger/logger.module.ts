import { Module } from '@nestjs/common';
import { RequestModule } from '../request/request.module';
import { LoggerService } from './logger.service';
import { RequestService } from '../request/request.service';

@Module({
  imports: [RequestModule],
  providers: [LoggerService, RequestService],
  exports: [LoggerService, RequestService],
})
export class LoggerModule {}
