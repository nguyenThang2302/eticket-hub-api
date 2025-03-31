import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
import { fullMaskingData, isApiSkipped } from 'src/api/utils/helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!isApiSkipped(request.url, request.method)) {
      const method = request.method;
      const url = request.url;
      const headers = request.headers;
      const instanceLogger = this.loggerService.Logger(request['requestId']);

      let userID;
      if (!headers['authorization']) {
        userID = ' ';
      } else {
        const token = headers['authorization'].split(' ')[1];
        const payload = this.jwtService.decode(token);
        userID = payload['sub'];
      }

      return next.handle().pipe(
        tap((data) => {
          instanceLogger.log(
            'info',
            `${method} ${url} ${userID} header=${JSON.stringify(fullMaskingData(headers))} body=${JSON.stringify(fullMaskingData(data.data))}`,
          );
        }),
      );
    }
    return next.handle().pipe(tap((data) => {}));
  }
}
