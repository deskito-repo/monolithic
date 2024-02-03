import { Strategy, Profile, IStrategyOption } from 'passport-twitter';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { socialProvider } from '@global/enums/SocialProvider';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
  constructor(config: Config) {
    super({
      consumerKey: process.env.TWITTER_OAUTH_CLIENT_ID!,
      consumerSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET!,
      callbackURL: `${config.serverHost}/auth/callback`,
      includeEmail: true,
    } satisfies IStrategyOption);
  }

  async validate(_at: string, _rt: string, profile: Profile) {
    const { name, emails, displayName } = profile;
    return {
      provider: 'TWITTER' satisfies keyof typeof socialProvider,
      name: name?.givenName,
      email: emails?.[0].value,
      displayName,
    };
  }
}
