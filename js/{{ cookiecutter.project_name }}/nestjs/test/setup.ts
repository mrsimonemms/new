process.env.LOG_LEVEL = 'silent';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '../src/app.module';

let app: INestApplication;

export const destroyApp = async () => {
  if (app) {
    await app.close();

    /* Remove definition to prevent being run again */
    app = undefined;
  }
};

export const request = async (): Promise<
  () => supertest.SuperTest<supertest.Test>
> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  return () => supertest(app.getHttpServer());
};

export { supertest };

// Ensure that the test app is correctly destroyed after use
afterEach(() => destroyApp());
