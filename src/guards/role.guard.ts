import { Role } from 'global/enums/UserRole';
import {
  Injectable, CanActivate, ExecutionContext, Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { ROLES_KEY as USER_KEY } from 'src/decorators/Roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) { /** */ }

  canActivate(context: ExecutionContext) {
    const [role] = this.reflector.getAllAndOverride<Role[]>(USER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];
    if (role === undefined) {
      return true;
    }
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const { user } = (req.raw as any);
    if (!user) {
      return false;
    }
    this.logger.log('user role: ', user.role);
    this.logger.log('required role: ', role);
    return user.role >= role;
  }
}
