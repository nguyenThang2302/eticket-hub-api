import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
}));
