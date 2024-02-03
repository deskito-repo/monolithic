import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SessionService } from 'src/modules/session/session.service';
import { TokenService } from 'src/modules/session/token.service';
import { UserService } from 'src/modules/user/user.service';
import { AccessToken } from 'src/types/Token.type';
import { parseCookies } from 'src/utils/parseCookies';

type Cookies = {
  access_token?: string;
  refresh_token?: string;
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) { /** */ }

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const { cookie } = req.headers;
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = parseCookies<Cookies>(cookie || '');
    if (!accessToken && !refreshToken) {
      next();
      return;
    }
    try {
      const user = await this.tokenService.verify<AccessToken>(accessToken || '');
      (req as any).user = user;
      this.logger.log('user info: ');
      this.logger.log(user);
    } catch {
      if (!refreshToken) {
        this.logger.log('refresh token is expired');
        throw new UnauthorizedException();
      }
      this.logger.log('maybe accessToken expired or refresh token malformed');
      const { userId, sessionId } = await this.sessionService.refresh(refreshToken);
      const user = await this.userService.findOne({ id: userId });
      if (user === undefined) {
        this.logger.log('user is not exist');
        throw new UnauthorizedException();
      }
      const payload = { ...user, sessionId, userId: user.id };
      const takeOver = await this.tokenService.generate(payload);
      (res as any).takeOver = takeOver;
      (req as any).user = takeOver.accessUser;
    }
    next();
  }
}
