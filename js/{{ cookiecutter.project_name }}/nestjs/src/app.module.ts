import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { LoggerModule, Params, PinoLogger } from 'nestjs-pino';
import config from './config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PinoTypeOrmLogger } from './lib/pinoTypeOrmLogger';
import { LoggerOptions } from 'typeorm';
import { HealthModule } from './health/health.module';

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
