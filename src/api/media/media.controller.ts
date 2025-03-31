import {
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../common/guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from 'jsonwebtoken';

@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('profile-avatars')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    return await this.mediaService.uploadProfileAvater(file, userId);
  }
}
