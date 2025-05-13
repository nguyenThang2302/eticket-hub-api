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
      throw new ForbiddenException('CANNOT_ACCESS_RESOURCE');
    }
    await this.imageQueue.add('UploadAvatarToCloudinary', {
      file,
      userId,
    });
    return { message: 'Success' };
  }

  async uploadQRTicket(qrCodeTicket: string, orderId: string, ticketInfo: any) {
    await this.imageQueue.add('UploadQRTicketToCloudinary', {
      qrCodeTicket,
      orderId,
      ticketInfo,
    });
  }

  async uploadEventImage(file: Express.Multer.File, eventId: string) {
    await this.imageQueue.add('UploadEventImageToCloudinary', {
      file,
      eventId,
    });
  }

  async uploadLogoOrganizer(file: Express.Multer.File, organizeId: string) {
    await this.imageQueue.add('UploadLogoOrganizerToCloudinary', {
      file,
      organizeId,
    });
  }
}
