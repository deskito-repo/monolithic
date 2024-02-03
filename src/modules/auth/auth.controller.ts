import { Config } from 'src/config';
import {
  Controller, Post, Get, Res, Body, UseGuards, Query,
} from '@nestjs/common';
import { SignIn, SignUp } from '@global/DTOs/auth.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import dayjs = require('dayjs');
import { AuthGuard } from '@nestjs/passport';
import { Profile } from 'passport-google-oauth20';
import { Req } from '@nestjs/common/decorators';
import { getMetaRedirectHTML } from 'src/utils/getMetaRedirectHTML';
import { socialProvider } from '@global/enums/SocialProvider';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from '../session/session.constant';
import { OAUTH_PAYLOAD_COOKIE_NAME } from './auth.constants';

const GoogleGuard = () => UseGuards(AuthGuard('google'));
const NaverGuard = () => UseGuards(AuthGuard('naver'));
const TwitterGuard = () => UseGuards(AuthGuard('twitter'));

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly config: Config) { /** */ }

  @Post('signin')
  async signIn(
    @Res() res: FastifyReply,
    @Body() form: SignIn.RequestBody,
  ) {
    const info = await this.authService.signIn(form);
    this.setTokenCookies(res, info);
    res.send(info.accessUser);
  }

  @Post('signup')
  async signUp(
    @Res() res: FastifyReply,
    @Body() form: SignUp.RequestBody,
  ) {
    const info = await this.authService.signUp(form);
    this.setTokenCookies(res, info);
    res.send(info.accessUser);
  }

  private setTokenCookies(res: FastifyReply, { accessToken, refreshToken }: Record<'accessToken' | 'refreshToken', string>) {
    res.setCookie('access_token', accessToken, {
      sameSite: true,
      httpOnly: true,
      secure: true,
      expires: dayjs().add(ACCESS_TOKEN_EXPIRES).toDate(),
    });
    res.setCookie('refresh_token', refreshToken, {
      sameSite: true,
      httpOnly: true,
      secure: true,
      expires: dayjs().add(REFRESH_TOKEN_EXPIRES).toDate(),
    });
  }

  /**
   * @description
   * data couldn't transfer to callback page when social login
   * and session method (aka express-session) does not insure consistent
   * so as using cookie, it could be solved
   * i know, this is hack. but it's working well
   *
   * @warn
   * it should be use 127.0.0.1 instead of localhost because of chromium issue on dev
   *
   * @example
   * http://127.0.0.1:3000/auth/social?redirectUrl=${frontendRefreshUrl}&provider=GOOGLE
   */
  @Get('social')
  signinSocial(@Res() res: FastifyReply, @Query() query: {
    /** redirect url to redirect after oauth redirect */
    redirectUrl: string;
    provider: keyof typeof socialProvider;
  }) {
    res.setCookie(OAUTH_PAYLOAD_COOKIE_NAME, encodeURIComponent(JSON.stringify(query)), { path: '/', maxAge: 1000 * 60 * 5 });
    const html = getMetaRedirectHTML(`${this.config.serverHost}/auth/${query.provider.toLowerCase()}`);
    res.type('text/html').send(html);
  }

  @GoogleGuard()
  @Get('google')
  signInGoogle() {}

  @TwitterGuard()
  @Get('twitter')
  signInTwitter() {}

  @NaverGuard()
  @Get('naver')
  signInNaver() {}

  private oauthCallback(
    req: FastifyRequest & { user: Profile },
    res: FastifyReply,
  ) {
    const { user, cookies } = req;
    const payloadJSON = cookies[OAUTH_PAYLOAD_COOKIE_NAME];
    const payload = {
      user,
      ...JSON.parse(decodeURIComponent(payloadJSON!)),
    };
    res
      .clearCookie(OAUTH_PAYLOAD_COOKIE_NAME)
      .status(302)
      .redirect(
        `${payload.redirectUrl}?payload=${encodeURIComponent(JSON.stringify(payload))}`,
      );
  }

  @GoogleGuard()
  @Get('callback')
  authSocial(
    @Req() req: FastifyRequest & { user: Profile },
    @Res() res: FastifyReply,
  ) {
    this.oauthCallback(req, res);
  }
}
