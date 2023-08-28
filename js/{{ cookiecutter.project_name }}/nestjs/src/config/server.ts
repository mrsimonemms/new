import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  enableShutdownHooks: process.env.SERVER_ENABLE_SHUTDOWN_HOOKS === 'true',
  port: Number(process.env.SERVER_PORT ?? 3000),
}));
