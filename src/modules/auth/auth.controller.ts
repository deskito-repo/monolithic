import {
  Body, Controller, Post, Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import * as AuthDTO from './auth.dtos';
import * as UserDTO from '../user/user.dtos';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('/signin')
  async signin(@Body() user: AuthDTO.SignInDto, @Res() res: FastifyReply) {
    const { persisted, accessToken, refreshToken } = await this.authService.signin(user);
    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);
    res.send(persisted);
  }

  @Post('/signup')
  async signup(@Body() user: UserDTO.InsertOne, @Res() res: FastifyReply) {
    const { persisted, accessToken, refreshToken } = await this.authService.signup(user);
    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);
    res.send(persisted);
  }

  @Post('/signout')
  async signout(@Res() res: FastifyReply) {
    this.cookieService.removeAccessToken(res);
    this.cookieService.removeRefreshToken(res);
    res.send();
  }
}
