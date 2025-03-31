import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadImageProcessor } from './upload.processor';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/api/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [UploadImageProcessor, CloudinaryService, CloudinaryProvider],
  exports: [UploadImageProcessor, CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
