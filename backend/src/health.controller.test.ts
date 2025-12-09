import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return ok status with timestamp', () => {
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(typeof result.timestamp).toBe('string');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
  });
});
