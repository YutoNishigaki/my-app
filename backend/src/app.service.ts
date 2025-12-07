import { Injectable } from '@nestjs/common';
import { Greeting } from './greeting.model.js';

@Injectable()
export class AppService {
  getHello(): Greeting {
    return { message: 'Hello API' };
  }
}
