import { Injectable } from '@nestjs/common';
import * as AuthAPI from 'src/global/APIs/auth.api';
import * as UserAPI from 'src/global/APIs/user.api';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {}

  async signin(params: AuthAPI.SignIn.Request) {
    const user = await this.userService.getOneUserAfterVerify(params);
    const { userId, nickname, role } = user;
    const { id: sessionId } = await this.sessionService.insertOne({ role, userId });
    const res = await this.tokenService.generateTokens({ ...user, sessionId });
    return {
      persisted: { nickname, role },
      ...res,
    };
  }

  async signup(user: UserAPI.InsertOne.Request) {
    await this.userService.insertOne(user);
    return this.signin(user);
  }

  /**
   *
   */
  async signinSocial() {
    //
  }
}
