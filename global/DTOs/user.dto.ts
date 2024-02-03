/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UserEntity } from '@global/entities/User.entity';
import { PartialType } from '@binochoi/nestjs-mapped-types';

export namespace FindMany {
  export class RequestQuery {
    @Type(() => Number)
    @IsNumber()
    page: number;

    @Type(() => Number)
    @IsNumber()
    count: number;
  }
  export type Response = {
    list: Pick<UserEntity, 'id' | 'nickname' | 'role' | 'lastAccessDate'>[],
    count: number;
  };
}

export namespace FindOne {
  export class RequestQuery extends PartialType(UserEntity) {}
}
