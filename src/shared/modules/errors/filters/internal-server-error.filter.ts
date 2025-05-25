import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorService } from '../error.service';
import { I18nContext } from 'nestjs-i18n';
import { LoggerService } from '../../logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { fullMaskingData } from 'src/api/utils/helpers';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly errorService: ErrorService,
    @Inject(LoggerService) private readonly loggerService: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    const i18n = I18nContext.current(host);
    const stackTrace = exception.stack;

    let userID: string;
    if (!req.headers['authorization']) {
      userID = ' ';
    } else {
      const token = req.headers['authorization'].split(' ')[1];
      const payload = this.jwtService.decode(token);
      userID = payload['sub'];
    }
    this.loggerService.logError(host, status, req.body, exception);

    res.status(status).json(this.errorService.message(errors, i18n));
  }
}
