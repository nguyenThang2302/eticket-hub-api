import { registerAs } from '@nestjs/config';

export default registerAs('paypal', () => ({
  paypal_client_id: process.env.PAYPAL_CLIENT_ID,
  paypal_client_secret: process.env.PAYPAL_CLIENT_SECRET,
  paypal_url_base: process.env.PAYPAL_URL_BASE,
}));
