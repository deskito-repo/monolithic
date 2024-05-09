import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StrategyBridgeProfile } from './strategies/google.strategy';
import { UserService } from '../user/user.service';

@Injectable()
export class SocialService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { /** */ }

  async signIn(profile: StrategyBridgeProfile) {
    if (profile.email === undefined) {
      throw new Error('social user has no email');
    }
    const user = await this.userService.findOne({ id: profile.email });
    if (!user) {
      throw new NotFoundException();
    }
    return this.authService.signIn(user.id);
  }
}
