import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorService } from '../error.service';
import { I18nContext } from 'nestjs-i18n';
import { LoggerService } from '../../logger/logger.service';
import { JwtService } from '@nestjs/jwt';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly errorService: ErrorService,
    @Inject(LoggerService) private readonly loggerService: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    const i18n = I18nContext.current(host);
    const body = ctx.getRequest().body;

    this.loggerService.logError(host, status, body, exception);

    res.status(status).json(this.errorService.message(errors, i18n));
  }
}
