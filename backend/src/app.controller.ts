import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Greeting } from './greeting.model.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Greeting {
    return this.appService.getHello();
  }
}
