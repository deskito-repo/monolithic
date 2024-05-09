import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { socialProvider, type SocialProviderKey } from 'global/enums/SocialProvider';

export interface StrategyBridgeProfile {
  provider: SocialProviderKey;
  name?: string;
  email?: string;
  displayName: string;
}
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(config: Config) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      callbackURL: `http://${config.serverHost}/api/auth/callback`,
      scope: ['email', 'profile'],
    } satisfies StrategyOptions);
  }

  async validate(_at: string, _rt: string, profile: Profile) {
    const { name, emails, displayName } = profile;
    return {
      provider: 'GOOGLE' satisfies keyof typeof socialProvider,
      name: name?.givenName,
      email: emails?.[0].value,
      displayName,
    } satisfies StrategyBridgeProfile;
  }
}
