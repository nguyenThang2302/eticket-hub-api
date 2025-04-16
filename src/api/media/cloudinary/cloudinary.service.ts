import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { UserService } from 'src/api/user/user.service';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';
import { Readable } from 'stream';
import { Repository } from 'typeorm';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(OrderTicketImage)
    private readonly orderTicketImageRepository: Repository<OrderTicketImage>,
  ) {}

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

  async uploadQRTicket(
    qrCodeTicket: string,
    orderId: string,
    ticketInfo: any,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const matches = qrCodeTicket.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return reject(new Error('Invalid base64 image'));
      }

      const buffer = Buffer.from(matches[2], 'base64');

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'tickets',
          public_id: `ticket-${orderId}-${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          const url = result.secure_url;
          const orderTicketImage = new OrderTicketImage();
          orderTicketImage.order_id = orderId;
          orderTicketImage.qr_ticket_url = url;
          orderTicketImage.code = ticketInfo.code;
          orderTicketImage.ticket_name = ticketInfo.ticketName;
          orderTicketImage.seat_location = ticketInfo.seatName;
          orderTicketImage.price = parseInt(ticketInfo.ticketPrice, 10);
          orderTicketImage.is_scanned = false;
          this.orderTicketImageRepository.save(orderTicketImage);
          resolve(result);
        },
      );

      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      stream.pipe(upload);
    });
  }
}
