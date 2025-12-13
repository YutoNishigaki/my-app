import { Query, Resolver } from '@nestjs/graphql';
import { Greeting } from './greeting.schema';
import { GreetingService } from './greeting.service';

@Resolver(() => Greeting)
export class GreetingResolver {
  constructor(private readonly greetingService: GreetingService) {}

  @Query(() => Greeting, { description: '基本的な挨拶を返却する' })
  hello(): Greeting {
    return this.greetingService.getHello();
  }
}
