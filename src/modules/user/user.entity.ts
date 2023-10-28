import { IsDate, IsIn, IsString } from 'class-validator';
import {
  RoleValue, SocialProvider, User, role, socialProvider,
} from '@app/global/entities/User';

export class UserEntity implements User {
    signUpDate: Date;
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
    password: string;

    @IsIn(Object.values(socialProvider))
    socialProvider: SocialProvider;
}
