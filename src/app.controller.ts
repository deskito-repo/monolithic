import { Controller, Get } from '@nestjs/common';
import { client } from 'src/database/db';

@Controller()
export class AppController {
  @Get('/health-check')
  async healthCheck(): Promise<string> {
    await client.connect();
    return 'OK';
  }
}
