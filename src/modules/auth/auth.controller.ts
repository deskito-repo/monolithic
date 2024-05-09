import {
  Controller, Post, Get, Res, Body, UseGuards,
  Req,
} from '@nestjs/common';
import * as AuthDto from 'global/dtos/auth.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import dayjs = require('dayjs');
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ONE_MONTH } from './auth.constants';
import type { StrategyBridgeProfile } from './strategies/google.strategy';
import { SocialService } from './social.service';

const GoogleGuard = () => UseGuards(AuthGuard('google'));
// const NaverGuard = () => UseGuards(AuthGuard('naver'));
// const TwitterGuard = () => UseGuards(AuthGuard('twitter'));

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialService: SocialService,
  ) { /** */ }

  @Post('signin')
  async signIn(
    @Res() res: FastifyReply,
    @Body() form: AuthDto.SignIn.RequestBody,
  ) {
    const { user, session } = await this.authService.signIn(form.id);
    await this.authService.validateLocalPassword(form.password || '', user.password || '');
    res.setCookie('session_token', session.id, {
      sameSite: true,
      httpOnly: true,
      secure: true,
      expires: dayjs().add(ONE_MONTH).toDate(),
    });
    res.send(user);
  }

  @Post('signup')
  async signUp(
    @Res() res: FastifyReply,
    @Body() form: AuthDto.LocalSignUp.RequestBody,
  ) {
    const { user, session } = await this.authService.signUp(form);
    res.setCookie('session_token', session.id, {
      sameSite: true,
      httpOnly: true,
      secure: true,
      expires: dayjs().add(ONE_MONTH).toDate(),
    });
    res.send(user);
  }

  @GoogleGuard()
  @Get('google')
  signInGoogle() {}

  //   @TwitterGuard()
  //   @Get('twitter')
  //   signInTwitter() {}
  //
  //   @NaverGuard()
  //   @Get('naver')
  //   signInNaver() {}

  @GoogleGuard()
  @Get('callback')
  async authSocial(
    @Req() req: FastifyRequest & { user: StrategyBridgeProfile },
    @Res() res: FastifyReply,
  ) {
    const data = await this.socialService.signIn(req.user);
    if (!data) {
      res.status(302).redirect('/login');
      return;
    }
    const payload = data && encodeURIComponent(JSON.stringify(data.user));
    res
      .setCookie('session_token', data.session.id, {
        sameSite: true,
        httpOnly: true,
        secure: true,
        expires: dayjs().add(ONE_MONTH).toDate(),
      })
      .status(302)
      .redirect(`/refresh?payload=${payload || ''}`);
  }
}
