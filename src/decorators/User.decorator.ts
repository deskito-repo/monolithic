import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import type { Session as LuciaSession } from 'lucia';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<FastifyRequest>();
  return (req.raw as any).session;
});

export type IUser = LuciaSession | undefined;
