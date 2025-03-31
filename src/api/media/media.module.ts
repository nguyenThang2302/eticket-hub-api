import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CloudinaryModule, UserModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
