import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.RD_HOST || 'localhost',
  port: process.env.RD_PORT || 6379,
}));
