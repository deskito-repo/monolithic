import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AccessToken, RefreshToken } from 'src/types/Token.type';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<FastifyRequest>();
  return (req.raw as any).user;
});

export type IUser = (AccessToken & RefreshToken) | undefined;
