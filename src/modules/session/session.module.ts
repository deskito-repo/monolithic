import { Module } from '@nestjs/common';
import luciaProvider from 'src/providers/lucia';
import { SessionService } from './session.service';

@Module({
  providers: [SessionService, luciaProvider],
  exports: [SessionService],
})
export class SessionModule {}
