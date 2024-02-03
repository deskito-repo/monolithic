import { Role } from '@global/enums/UserRole';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = Symbol('user_roles');
export const Roles = (role: Role[]) => SetMetadata(ROLES_KEY, role);
