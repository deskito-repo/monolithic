/* eslint-disable max-classes-per-file */
import { createDto } from 'nestjs-valibot';
import { type User, user } from 'global/entities/user.entity';
import * as v from 'valibot';

export namespace FindMany {
  export class RequestQuery extends createDto(
    v.object({
      page: v.number(),
      count: v.number(),
    }),
  ) {}
  export type Response = {
    list: Pick<User, 'id' | 'nickname' | 'role'>[];
    count: number;
  };
}

export namespace FindOne {
  export class RequestQuery extends createDto(v.partial(user)) {}
}
