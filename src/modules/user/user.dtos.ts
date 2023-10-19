import { PickType } from '@nestjs/mapped-types';
import * as API from 'src/global/APIs/user.api';
import { UserEntity as Entity } from './user.entity';

export class InsertOne extends PickType(Entity, ['name', 'nickname', 'password', 'phoneNumber', 'role', 'userId'] satisfies (keyof API.InsertOne.Request)[]) {}
