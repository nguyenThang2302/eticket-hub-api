import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRTicketService {
  async generateQRCode(token: string): Promise<string> {
    return await QRCode.toDataURL(token);
  }
}
