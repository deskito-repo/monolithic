import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Injectable()
export class CookieService {
  setAccessToken(res: FastifyReply, token: string) {
    (res as any)
      .setCookie('access_token', token, {
        path: '/',
        secure: false,
        httpOnly: true,
      });
  }

  removeAccessToken(res: FastifyReply) {
    (res as any).clearCookie('access_token');
  }

  setRefreshToken(res: FastifyReply, token: string) {
    (res as any)
      .setCookie('refresh_token', token, {
        path: '/',
        secure: false,
        httpOnly: true,
      });
  }

  removeRefreshToken(res: FastifyReply) {
    (res as any).clearCookie('refresh_token');
  }
}
