import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserModule } from '../user/user.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';

@Module({
  imports: [
    CloudinaryModule,
    UserModule,
    TypeOrmModule.forFeature([OrderTicketImage]),
  ],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryService],
  exports: [MediaService, CloudinaryService],
})
export class MediaModule {}
