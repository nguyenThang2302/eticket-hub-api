import { InjectQueue } from '@nestjs/bull';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UserService } from '../user/user.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectQueue('imageProcessing') private readonly imageQueue: Queue,
    private readonly userService: UserService,
  ) {}

  async uploadProfileAvater(file: Express.Multer.File, userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new ForbiddenException('CUS-0402');
    }
    await this.imageQueue.add('UploadAvatarToCloudinary', {
      file,
      userId,
    });
    return { message: 'Success' };
  }
}
