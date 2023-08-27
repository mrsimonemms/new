import { PinoLogger } from 'nestjs-pino';
import { Logger as TypeOrmLogger } from 'typeorm';

export class PinoTypeOrmLogger implements TypeOrmLogger {
  constructor(protected logger: PinoLogger) {}

  logQuery(query: string, parameters?: any[]) {
    this.logger.debug(
      {
        query,
        parameters,
      },
      'TypeORM query',
    );
  }

  logQueryError(err: string, query: string, parameters?: any[]) {
    this.logger.error(
      {
        err,
        query,
        parameters,
      },
      'TypeORM error',
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(
      {
        time,
        query,
        parameters,
      },
      'TypeORM slow query',
    );
  }

  logSchemaBuild(schemaMessage: string) {
    this.logger.debug(
      {
        schemaMessage,
      },
      'TypeORM schema build',
    );
  }

  logMigration(migrationMessage: string) {
    this.logger.debug(
      {
        migrationMessage,
      },
      'TypeORM log migration',
    );
  }

  log(level: 'log' | 'info' | 'warn', logMessage: any) {
    if (level === 'warn') {
      this.logger.warn(
        {
          logMessage,
        },
        'TypeORM log warning',
      );
    } else {
      this.logger.info(
        {
          logMessage,
        },
        'TypeORM log message',
      );
    }
  }
}
