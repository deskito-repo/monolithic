import { Injectable, Logger } from '@nestjs/common';
import * as AuthDto from 'global/dtos/auth.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) { /** */ }

  async signIn(id: string) {
    const user = await this.userService.findOne({ id });
    if (user === undefined) {
      throw new BadRequestException('user is not exist');
    }
    this.logger.log('sign in ', user.id);
    const session = await this.sessionService.generate(id);
    return { user, session };
  }

  async signUp(params: AuthDto.LocalSignUp.RequestBody) {
    const user = await this.userService.insertOne(params);
    this.logger.log('sign up ', user.id);
    const session = await this.sessionService.generate(user.id);
    return { user, session };
  }

  async validateLocalPassword(password: string, hashed: string) {
    if (!password || !hashed || await bcrypt.compare(password, hashed)) {
      throw new UnauthorizedException();
    }
  }

  async logout() {
    return this.sessionService.destroyExpires();
  }
}
