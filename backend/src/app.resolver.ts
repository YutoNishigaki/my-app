import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service.js';
import { Greeting } from './greeting.model.js';

@Resolver(() => Greeting)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => Greeting, { name: 'hello' })
  getHello(): Greeting {
    return this.appService.getHello();
  }
}
