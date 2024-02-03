import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { socialProvider } from '@global/enums/SocialProvider';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(config: Config) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      callbackURL: `${config.serverHost}/auth/callback`,
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
    };
  }
}
