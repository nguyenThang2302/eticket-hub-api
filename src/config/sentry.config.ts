import { registerAs } from '@nestjs/config';

export default registerAs('sentry', () => ({
  sentry_dns: process.env.SENTRY_DSN,
  sentry_enabled: process.env.SENTRY_ENABLED,
  sentry_env: process.env.NODE_ENV,
}));
