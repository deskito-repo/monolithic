/* eslint-disable @typescript-eslint/no-namespace */
import { AccessToken } from '../entities/AccessToken';
import { User } from '../entities/User';

export namespace SignIn {
    export type Request = Pick<User, 'userId' | 'password'>;
    export type Response = AccessToken;
}
