import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.RD_HOST || 'localhost',
  port: parseInt(process.env.RD_PORT) || 6379,
  user: process.env.RD_USER || '',
  password: process.env.RD_PASSWORD || '',
  url: process.env.REDIS_URL,
}));
