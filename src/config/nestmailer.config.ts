import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('nestmailer', () => ({
  fromMailVerification: {
    name: process.env.MAIL_NAME,
    address: process.env.DEFAULT_MAIL_FROM,
  },
  contextMailVerification: {
    linkVerification: '',
    shopUrlRegister: process.env.SHOP_URL_REGISTER,
    shopEmail: process.env.SHOP_EMAIL,
    shopPhoneNumber: process.env.SHOP_PHONE_NUMBER,
    shopAddress: process.env.SHOP_ADDRESS,
    shopUrlHome: process.env.SHOP_URL_HOME,
    shopLogo: process.env.SHOP_LOGO,
  },
  urlVerificationMail: process.env.URL_VERIFICATION_MAIL,
  nestMailerConfig: {
    transport: {
      host: process.env.MAILDEV_INCOMING_HOST,
      port: parseInt(<string>process.env.MAILDEV_INCOMING_PORT),
      ignoreTLS: true,
      secure: process.env.MAILDEV_INCOMING_SECURE === 'true',
      auth: {
        user: process.env.MAILDEV_INCOMING_USER,
        pass: process.env.MAILDEV_INCOMING_PASS,
      },
    },
    defaults: {
      from: `"No Reply" <${process.env.DEFAULT_MAIL_FROM}>`,
    },
    template: {
      dir: join(__dirname, '../api/mail/template/'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  },
}));
