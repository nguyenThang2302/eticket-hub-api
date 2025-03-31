import {
  Module,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  BadRequestExceptionFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
  UnprocessableEntityExceptionFilter,
} from './filters';
import { ValidationError } from 'class-validator';
import { ErrorService } from './error.service';
import { LoggerService } from '../logger/logger.service';
import { RequestService } from '../request/request.service';

@Module({
  imports: [],
  providers: [
    ErrorService,
    LoggerService,
    RequestService,
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InternalServerErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnprocessableEntityExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]) =>
          new UnprocessableEntityException(errors),
      }),
    },
  ],
})
export class ErrorModule {}
