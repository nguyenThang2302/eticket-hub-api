import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: +configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        ttl: +configService.get<number>('redis.ttl', 60),
      }),
    }),
  ],
  exports: [CacheModule, RedisCacheService],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
