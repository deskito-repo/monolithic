import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [UserModule, SessionModule, JwtModule.register({
    global: true,
    secret: 'anonymous-secret',
  })],
  controllers: [AuthController],
  providers: [AuthService, TokenService, CookieService],
})
export class AuthModule {}
