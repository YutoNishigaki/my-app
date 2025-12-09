import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppService } from '../app.service';
import { GreetingResolver } from './greeting.resolver';

describe('GreetingResolver', () => {
  let resolver: GreetingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingResolver, AppService],
    }).compile();

    resolver = module.get<GreetingResolver>(GreetingResolver);
  });

  it('should resolve hello query', () => {
    expect(resolver.hello()).toEqual({ message: 'Hello API' });
  });
});
