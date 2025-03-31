import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expire_time: +process.env.ACCESS_TOKEN_EXPIRE_TIME,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expire_time: +process.env.REFRESH_TOKEN_EXPIRE_TIME,
}));
