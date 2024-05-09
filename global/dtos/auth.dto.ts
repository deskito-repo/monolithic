/* eslint-disable max-classes-per-file */
import { createDto } from 'nestjs-valibot';
import { user } from 'global/entities/user.entity';
import * as v from 'valibot';

export namespace SignIn {
  export class RequestBody extends createDto(
    v.pick(user, ['id', 'password']),
  ) {}
}

export namespace LocalSignUp {
  export class RequestBody extends createDto(
    v.pick(user, ['id', 'nickname', 'password', 'socialProvider']),
  ) {}
}
