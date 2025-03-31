import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { UserService } from 'src/api/user/user.service';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly userService: UserService) {}

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'profiles',
          public_id: `avatar-${userId}-${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          const url = result.secure_url;
          this.userService.updateAvatarUrl(userId, url);
        },
      );

      const stream = new Readable();
      stream.push(Buffer.from(file.buffer));
      stream.push(null);

      stream.pipe(upload);
    });
  }
}
