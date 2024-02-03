import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/config';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [Config],
      useFactory: async (config: Config) => ({ secret: config.TOKEN_SECRET }),
    }),
  ],
  providers: [SessionService, TokenService],
  exports: [SessionService, TokenService],
})
export class SessionModule {}
