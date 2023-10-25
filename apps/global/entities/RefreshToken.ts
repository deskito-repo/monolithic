import { User } from './User';

export type RefreshToken = Pick<User, 'userId'> & { sessionId: number }
