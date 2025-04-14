import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CloudinaryService } from './cloudinary.service';

@Processor('imageProcessing')
export class UploadImageProcessor {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Process('UploadAvatarToCloudinary')
  async UploadAvatarToCloudinary(dataJob: Job<any>) {
    const { file, userId } = dataJob.data;
    try {
      return await this.cloudinaryService.uploadImage(file, userId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Process('UploadQRTicketToCloudinary')
  async UploadQRTicketToCloudinary(dataJob: Job<any>) {
    const { qrCodeTicket, orderId, ticketInfo } = dataJob.data;
    try {
      return await this.cloudinaryService.uploadQRTicket(
        qrCodeTicket,
        orderId,
        ticketInfo,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
