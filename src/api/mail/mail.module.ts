/* eslint-disable @typescript-eslint/ban-types */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './mail.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<Object>('nestmailer.nestMailerConfig'),
    }),
    ConfigModule,
  ],
  providers: [EmailProcessor, BullModule],
  exports: [BullModule],
})
export class MailModule {}
