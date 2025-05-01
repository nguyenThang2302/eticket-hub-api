import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          redis: {
            host: configService.get<string>('redis.host'),
            port: +configService.get<number>('redis.port'),
            password: configService.get<string>('redis.password'),
            reconnectOnError: () => true,
          },
        };
      },
    }),
    BullModule.registerQueue(
      {
        name: 'emailSending',
      },
      {
        name: 'imageProcessing',
      },
      {
        name: 'holding-seats',
      },
      {
        name: 'chatProcessing',
      },
    ),
  ],
  exports: [BullModule],
})
export class RedisModule {}
