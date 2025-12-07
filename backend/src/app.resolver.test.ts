import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let resolver: AppResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppResolver, AppService],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
  });

  describe('hello query', () => {
    it('should resolve greeting message', () => {
      expect(resolver.getHello()).toEqual({ message: 'Hello API' });
    });
  });
});
