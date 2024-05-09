import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { SocialService } from './social.service';

const strategies = [
  GoogleStrategy,
  // TwitterStrategy,
  // NaverStrategy,
];
@Module({
  imports: [SessionModule, UserModule],
  providers: [
    // ...strategies,
    AuthService,
    SocialService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
