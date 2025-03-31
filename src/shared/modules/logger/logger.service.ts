import { createLogger, format, transports } from 'winston';

const myFormat = format.printf(({ label, level, message, timestamp }) => {
  return `[${label}] [${timestamp}] [${level}] ${message}`;
});

export class LoggerService {
  constructor() {} // @Inject(RequestService) readonly requestService:RequestService,

  Logger(requestId: string) {
    // const requestId = this.requestService.getRequestId();
    if (process.env.NODE_ENV === 'development') {
      const loggerDev = createLogger({
        format: format.combine(
          format.label({ label: requestId }),
          format.timestamp(),
          myFormat,
        ),
        transports: [new transports.Console()],
      });
      return loggerDev;
    } else {
      const loggerProd = createLogger({
        format: format.combine(
          format.label({ label: requestId }),
          format.timestamp(),
          myFormat,
        ),
        transports: [new transports.File({ filename: 'logs/combine.log' })],
      });
      return loggerProd;
    }
  }
}
