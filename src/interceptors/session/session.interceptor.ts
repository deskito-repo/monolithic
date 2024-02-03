import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SessionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<FastifyReply>();
    const { takeOver } = (res.raw as any);
    if (!takeOver) {
      return next.handle();
    }
    res.header('X-User', JSON.stringify(takeOver.accessUser));
    res.setCookie('access_token', takeOver.accessToken);
    res.setCookie('refresh_token', takeOver.refreshToken);
    this.logger.log('user refreshed: ', takeOver);
    return next.handle();
  }
}
