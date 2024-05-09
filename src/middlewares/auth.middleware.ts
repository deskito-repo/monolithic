import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SessionService } from 'src/modules/session/session.service';
import { parseCookies } from 'src/utils/parseCookies';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) { /** */ }

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: (error?: any) => void) {
    const {
      session_token: sessionId,
    } = parseCookies(req.headers.cookie || '');
    if (!sessionId) {
      next();
      return;
    }
    const { session } = await this.sessionService.validate(sessionId);
    (req as any).session = session;
    next();
  }
}
