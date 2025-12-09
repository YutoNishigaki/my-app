import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { Greeting } from './greeting.model';

@Resolver(() => Greeting)
export class GreetingResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => Greeting, { description: '基本的な挨拶を返却する' })
  hello(): Greeting {
    return this.appService.getHello();
  }
}
