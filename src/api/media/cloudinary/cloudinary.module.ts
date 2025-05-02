import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadImageProcessor } from './upload.processor';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';
import { Event } from 'src/database/entities/event.entity';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    TypeOrmModule.forFeature([OrderTicketImage, Event]),
  ],
  providers: [UploadImageProcessor, CloudinaryService, CloudinaryProvider],
  exports: [UploadImageProcessor, CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
