import { Injectable } from '@nestjs/common';

export type GreetingResponse = {
  message: string;
};

@Injectable()
export class AppService {
  getHello(): GreetingResponse {
    return { message: 'Hello API' };
  }
}
