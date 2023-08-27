import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.disable('x-powered-by');
  const config = app.get(ConfigService);
  app.useLogger(app.get(Logger));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const logger = await app.resolve(PinoLogger);

  if (config.get<boolean>('server.enableShutdownHooks')) {
    logger.debug('Enabling shutdown hooks');
    app.enableShutdownHooks();
  } else {
    logger.debug('Shutdown hooks not enabled');
  }

  const port = config.get('server.port');

  logger.debug('Starting HTTP listener');
  await app.listen(port);
  logger.info({ port }, 'Application running');
}

bootstrap().catch((err) => {
  /* Unlikely to get to here but a final catchall */
  console.log(err.stack);
  process.exit(1);
});
