import { Address } from 'nodemailer/lib/mailer';

export type SendVerificationEmailDto = {
  from?: Address;
  recipients: Address[];
  subject: string;
  text?: string;
  context: Object;
  template: string;
};
