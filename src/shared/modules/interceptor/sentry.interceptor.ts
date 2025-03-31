import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/core';
import * as requestIp from 'request-ip';
import { statusCodeErrorSkipSentry } from 'src/config/helpers.config';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    return next.handle().pipe(
      tap(null, (exception) => {
        const response = exception.getResponse();
        if (
          response['statusCode'] >= 400 &&
          !statusCodeErrorSkipSentry.includes(response['statusCode'])
        ) {
          const scope = Sentry.getCurrentScope();
          scope.setTag('method', method);
          scope.setTag('enpoint', url);
          scope.setTag('enviroment', process.env.NODE_ENV);
          scope.setTag('level', 'error');
          scope.setTag('user_agent', request.headers['user-agent']);
          scope.setTag('error_code', exception['code']);
          scope.setTag('request_ip', requestIp.getClientIp(request));
          Sentry.captureException(exception);
        }
      }),
    );
  }
}
