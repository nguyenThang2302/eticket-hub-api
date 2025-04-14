/* eslint-disable @typescript-eslint/ban-types */
import { Process, Processor } from '@nestjs/bull';
import { SendVerificationEmailDto } from './mail.interface';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTicketImage } from 'src/database/entities/order_ticket_image.entity';
import { Repository } from 'typeorm';

@Processor('emailSending')
export class EmailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(OrderTicketImage)
    private readonly orderTicketImageRepository: Repository<OrderTicketImage>,
  ) {}

  @Process('SendEmailVerication')
  async sendVerificationLink(dataJob: Job<SendVerificationEmailDto>) {
    const { from, recipients, subject, context, template } = dataJob.data;

    const options = {
      from:
        from ??
        this.configService.get<Object>('nestmailer.fromMailVerification'),
      to: recipients,
      subject,
      template: template,
      context: context,
    };

    try {
      const result = await this.mailerService.sendMail(options);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Process('SendEmailConfirmOrder')
  async sendEmailConfirmOrder(dataJob: Job<any>) {
    const { from, recipients, subject, context, template } = dataJob.data;

    const orderId = context['orderId'];

    const ticketInfos = await this.orderTicketImageRepository.find({
      where: {
        order_id: orderId,
      },
      select: {
        ticket_name: true,
        seat_location: true,
        qr_ticket_url: true,
      },
    });

    context['tickets'] = ticketInfos;
    const options = {
      from:
        from ??
        this.configService.get<Object>('nestmailer.fromMailVerification'),
      to: recipients,
      subject,
      template: template,
      context: context,
    };

    try {
      const result = await this.mailerService.sendMail(options);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
