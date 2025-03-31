import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  url: process.env.APP_URL,
  node_env: process.env.NODE_ENV,
  port: +process.env.APP_PORT,
}));
