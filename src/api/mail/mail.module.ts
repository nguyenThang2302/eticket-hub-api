/* eslint-disable @typescript-eslint/ban-types */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './mail.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderTicketImage]),
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
