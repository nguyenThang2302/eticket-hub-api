import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisCacheService } from '../redis/redis-cache.service';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: RedisCacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') return next();

    const key = `CACHE:${req.originalUrl}`;
    const cachedResponse = await this.cacheService.get<string>(key);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.send(JSON.parse(cachedResponse));
    }

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      if (res.statusCode === 200) {
        this.cacheService
          .set(key, JSON.stringify(body), { ttl: 60 })
          .catch((err) => {
            throw new InternalServerErrorException(err);
          });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalSend(body);
    };

    next();
  }
}
