import {
  ExecutionContext,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';
import { fullMaskingData, isApiSkipped } from 'src/api/utils/helpers';
import { RequestService } from '../request/request.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly loggerService: LoggerService,
    @Inject(RequestService) private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
  ) {}
  use(req: Request, context: ExecutionContext, next: NextFunction) {
    const requestId = this.requestService.getRequestId();
    req['requestId'] = requestId;
    if (isApiSkipped(req['baseUrl'], req.method)) {
      next();
    } else {
      let userID;
      if (!req.headers['authorization']) {
        userID = ' ';
      } else {
        const token = req.headers['authorization'].split(' ')[1];
        const payload = this.jwtService.decode(token);
        userID = payload['sub'];
      }

      next();
    }
  }
}
