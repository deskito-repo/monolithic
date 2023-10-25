import { User } from './User';

export type AccessToken = Pick<User, 'nickname' | 'role'>
