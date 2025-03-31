/* eslint-disable @typescript-eslint/ban-types */
import { Process, Processor } from '@nestjs/bull';
import { SendVerificationEmailDto } from './mail.interface';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Processor('emailSending')
export class EmailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
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
}
