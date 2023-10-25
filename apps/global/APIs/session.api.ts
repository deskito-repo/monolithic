/* eslint-disable @typescript-eslint/no-namespace */
import type { Session } from '../entities/Session';

export namespace GetOne {
    export type Response = Session;
}
export namespace InsertOne {
    export type Request = Omit<Session, 'id' | 'expires'>;
    export type Response = Pick<Session, 'id'>;
}
