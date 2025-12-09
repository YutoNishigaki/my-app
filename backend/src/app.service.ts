import { Injectable } from '@nestjs/common';
import { Greeting } from './greeting/greeting.model';

@Injectable()
export class AppService {
  getHello(): Greeting {
    return { message: 'Hello API' };
  }
}
