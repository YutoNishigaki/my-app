import { Module } from '@nestjs/common';

import { GreetingResolver } from './greeting.resolver';
import { GreetingService } from './greeting.service';

@Module({
  providers: [GreetingService, GreetingResolver],
})
export class GreetingModule {}
