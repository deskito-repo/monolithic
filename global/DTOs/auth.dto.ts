/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { UserEntity } from '@global/entities/User.entity';
import { PickType } from '@binochoi/nestjs-mapped-types';

export namespace SignIn {
  export class RequestBody extends PickType(UserEntity, ['id', 'password']) {}
}

export namespace SignUp {
  export class RequestBody extends PickType(UserEntity, ['id', 'name', 'nickname', 'password', 'socialProvider']) {}
}
