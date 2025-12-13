import { Injectable } from '@nestjs/common';
import { Greeting } from './greeting.schema';

@Injectable()
export class GreetingService {
  getHello(): Greeting {
    return { message: 'Hello API' };
  }
}
