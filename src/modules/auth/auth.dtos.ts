import { IsString } from 'class-validator';
import * as API from '@app/global/APIs/auth.api';

export class SignInDto implements API.SignIn.Request {
    @IsString()
    userId: string;

    @IsString()
    password: string;
}
