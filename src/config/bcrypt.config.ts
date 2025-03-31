import { registerAs } from '@nestjs/config';

export default registerAs('bcrypt', () => ({
  salt_or_round: parseInt(<string>process.env.SALT_OR_ROUNDS),
}));
