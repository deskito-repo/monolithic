import {
  IsDate,
  IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches,
} from 'class-validator';
import { SetOptional, SetRequired } from 'type-fest';
import { ApiProperty } from '@nestjs/swagger';
import { role, type Role } from '@global/enums/UserRole';
import { type SocialProvider, socialProvider } from '@global/enums/SocialProvider';
import { userValidation } from '@global/validations/user.validation';

const validation = userValidation;
export class UserEntity {
  @ApiProperty()
  @Length(validation.userId.min, validation.userId.max, {
    message: `아이디는 ${validation.userId.min}~${validation.userId.max}자 사이여야 합니다.`,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(validation.userId.matches.default, {
    message: '아이디는 소문자 영문, 숫자만 가능합니다.',
  })
    id: string;

  @ApiProperty()
  @Length(validation.nickname.min, validation.nickname.max, {
    message: `닉네임은 ${validation.nickname.min}~${validation.nickname.max}자 사이여야 합니다.`,
  })
  @IsNotEmpty()
  @IsString()
    nickname: string;

  @ApiProperty()
  @Length(validation.name.min, validation.name.max, {
    message: `이름은 ${validation.name.min}~${validation.name.max}자 사이여야 합니다.`,
  })
  @IsNotEmpty()
  @IsString()
    name: string;

  @ApiProperty()
  @IsIn(Object.values(role))
    role: Role;

  @ApiProperty()
  @IsNotEmpty({ message: '휴대번호가 비어있습니다.' })
  @Length(0, validation.phoneNumber.max, { message: '' })
  @IsString()
  @IsOptional()
    phoneNumber: string | null = null;

  @ApiProperty()
  @Length(validation.password.min, validation.password.max, {
    message: `비밀번호는 ${validation.password.min}~${validation.password.max}자 사이여야 합니다.`,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Matches(validation.password.matches.default, {
    message: '비밀번호는 영어, 숫자, 특수문자가 하나씩 들어가야 합니다.',
  })
    password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(Object.values(socialProvider))
    socialProvider: SocialProvider;

  @ApiProperty()
  @IsDate()
    signUpDate: Date;

  @ApiProperty()
  @IsDate()
    lastAccessDate: Date;
}

export type User = SetOptional<InstanceType<typeof UserEntity>, 'socialProvider' | 'password'>;
export type LocalUser = SetRequired<Omit<User, 'socialProvider'>, 'password'>;
export type SocialUser = SetRequired<Omit<User, 'password'>, 'socialProvider'>;
