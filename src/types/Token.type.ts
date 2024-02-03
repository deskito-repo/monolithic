import { UserEntity } from '@global/entities/User.entity';
import { Role } from '@global/enums/UserRole';

export interface AccessToken {
  userId: UserEntity['id'];
  role: Role,
}

type SessionId = string;
export type RefreshToken = SessionId;
