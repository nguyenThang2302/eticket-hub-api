import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LoggerService } from '../logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private loggerService: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction) {
    this.loggerService.logRequest(request);

    next();
  }
}
