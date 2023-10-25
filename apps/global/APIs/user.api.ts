import type { User } from '../entities/User';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace InsertOne {
    export type Request = Pick<User, 'name' | 'nickname' | 'password' | 'phoneNumber' | 'userId'>;
}
