import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
// import { GoogleStrategy } from './strategies/google.strategy';
// import { TwitterStrategy } from './strategies/twitter.strategy';
// import { NaverStrategy } from './strategies/naver.strategy';
//
// const strategies = [
//   GoogleStrategy,
//   TwitterStrategy,
//   NaverStrategy,
// ];
@Module({
  imports: [SessionModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
