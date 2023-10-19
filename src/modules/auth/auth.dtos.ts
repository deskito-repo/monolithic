// import { PickType } from '@nestjs/mapped-types';
// import { AuthEntity as Entity } from './auth.entity';
import { IsString } from 'class-validator';
import * as API from 'src/global/APIs/auth.api';
//
export class SignInDto implements API.SignIn.Request {
    @IsString()
    userId: string;

    @IsString()
    password: string;
}
