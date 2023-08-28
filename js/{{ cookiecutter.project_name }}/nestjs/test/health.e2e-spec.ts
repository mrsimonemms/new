import * as supertest from 'supertest';
import { request } from './setup';

describe('HealthController (e2e)', () => {
  let app: supertest.Test;

  describe('/', () => {
    describe('GET', () => {
      beforeEach(async () => {
        app = (await request())().get('/health');
      });

      it('should return a healthy state', () => app.expect(200));
    });
  });
});
