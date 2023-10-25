import { PickType } from '@nestjs/mapped-types';
import * as API from '@app/global/APIs/user.api';
import { UserEntity as Entity } from './user.entity';

export class InsertOne extends PickType(Entity, ['name', 'nickname', 'password', 'phoneNumber', 'userId'] satisfies (keyof API.InsertOne.Request)[]) {}
