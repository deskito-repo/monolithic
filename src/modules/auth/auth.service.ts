import { Injectable, Logger } from '@nestjs/common';
import { SignIn, SignUp } from '@global/DTOs/auth.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UserEntity } from '@global/entities/User.entity';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import { TokenService } from '../session/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) { /** */ }

  /**
   * session create & refresh
   */
  async refresh(params: Pick<UserEntity, 'id' | 'nickname' | 'role'>) {
    const userId = params.id;
    const { id: sessionId } = await this.sessionService.setOne({ userId });
    const tokens = await this.tokenService.generate({ ...params, sessionId, userId });
    return tokens;
  }

  async signIn({ id, password }: SignIn.RequestBody) {
    const user = await this.userService.findOne({ id });
    if (user === undefined) {
      throw new BadRequestException('user is not exist');
    }
    if (user?.password && await bcrypt.compare(password || '', user?.password)) {
      throw new BadRequestException('user password is wrong');
    }
    this.logger.log('signin user', user);
    return this.refresh(user);
  }

  async signUp(params: SignUp.RequestBody) {
    const user = await this.userService.insertOne(params);
    return this.refresh(user);
  }

  async signInSocial(params: Parameters<UserService['insertOne']>[0]) {
    // let user = await this.userService.findOne({ searchBy: 'id', searchValue: params.id });
    // // if (user === undefined) {
    // //   user = await this.userService.insertOne(params);
    // // }
    // // this.logger.log('signin user', user);
    // return this.refresh(user);
  }

  async logout(sessionId: string) {
    return this.sessionService.destroy(sessionId);
  }
}
