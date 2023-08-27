import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import * as pino from 'pino';
import * as uuid from 'uuid';

export default registerAs(
  'logger',
  (): Params => ({
    pinoHttp: {
      level: process.env.LOG_LEVEL ?? 'info',
      serializers: pino.stdSerializers,
      genReqId: () => uuid.v4(),
      customLogLevel: (_, res, err) => {
        const { statusCode } = res;
        if (statusCode >= 400 && statusCode !== 404 && statusCode < 500) {
          return 'warn';
        }
        if (statusCode >= 500 || err) {
          return 'error';
        }

        return 'debug';
      },
    },
  }),
);
