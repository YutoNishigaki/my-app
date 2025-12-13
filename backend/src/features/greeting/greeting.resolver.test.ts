import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GreetingResolver } from './greeting.resolver';
import { GreetingService } from './greeting.service';

describe('GreetingResolver', () => {
  let resolver: GreetingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingResolver, GreetingService],
    }).compile();

    resolver = module.get<GreetingResolver>(GreetingResolver);
  });

  it('should resolve hello query', () => {
    expect(resolver.hello()).toEqual({ message: 'Hello API' });
  });
});
