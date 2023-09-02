import {
  HealthCheckService,
  TerminusModule,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let service: any;
  let dbCheck: any;

  beforeEach(async () => {
    service = {
      check: jest.fn(),
    };

    dbCheck = {
      pingCheck: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: service,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: dbCheck,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return a successful result', async () => {
    service.check.mockResolvedValue('OK');
    dbCheck.pingCheck.mockResolvedValue('DB OK');

    await expect(controller.check()).resolves.toBe('OK');

    expect(service.check).toHaveBeenCalled();

    await expect(service.check.mock.calls[0][0][0]()).resolves.toBe('DB OK');
  });
});
