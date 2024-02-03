import { Strategy, Profile, StrategyOption } from 'passport-naver';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { socialProvider } from '@global/enums/SocialProvider';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(config: Config) {
    super({
      clientID: process.env.NAVER_OAUTH_CLIENT_ID!,
      clientSecret: process.env.NAVER_OAUTH_CLIENT_SECRET!,
      callbackURL: `${config.serverHost}/auth/callback`,
    } satisfies StrategyOption);
  }

  async validate(_at: string, _rt: string, profile: Profile) {
    const {
      name, emails, displayName, photos,
    } = profile;
    return {
      provider: 'NAVER' satisfies keyof typeof socialProvider,
      name: name?.givenName,
      email: emails?.[0].value,
      displayName,
      photos,
    };
  }
}
