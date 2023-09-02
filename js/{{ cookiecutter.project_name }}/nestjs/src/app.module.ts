import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerModule, Params, PinoLogger } from 'nestjs-pino';
import { LoggerOptions } from 'typeorm';
import config from './config';
import { HealthModule } from './health/health.module';
import { PinoTypeOrmLogger } from './lib/pinoTypeOrmLogger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Params> =>
        configService.get<Params>('logger'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, PinoLogger],
      useFactory: async (
        configService: ConfigService,
        pinoLogger: PinoLogger,
      ): Promise<TypeOrmModuleOptions> => {
        const db = configService.get<TypeOrmModuleOptions>('db');

        /* Replace the default TypeOrm logger with PinoTypeOrmLogger */
        let logger: 'debug' | PinoTypeOrmLogger = 'debug';
        let logging = false;

        if (configService.get<LoggerOptions>('db.logging', false)) {
          logger = new PinoTypeOrmLogger(pinoLogger);
          logging = true;
        }

        return {
          ...db,
          logging,
          logger,
        };
      },
    }),

    // Load the internal modules
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
