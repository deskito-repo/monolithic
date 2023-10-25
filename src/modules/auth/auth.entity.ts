import { IsIn, IsString } from 'class-validator';
import { RoleValue, User, role } from '@app/global/entities/User';

export class AuthEntity implements User {
    id: number;

    @IsString()
    userId: string;

    @IsString()
    nickname: string;

    @IsString()
    name: string;

    @IsIn(Object.values(role))
    role: RoleValue;

    @IsString()
    phoneNumber: string;

    @IsString()
    signUpYMD: string;

    @IsString()
    password: string;
}
