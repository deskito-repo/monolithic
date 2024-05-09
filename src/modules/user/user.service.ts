import { role } from 'global/enums/UserRole';
import { Injectable } from '@nestjs/common';
import dayjs = require('dayjs');
import { UserRepository } from 'src/database/repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import * as AuthDto from 'global/dtos/auth.dto';

type Parameter<T extends (...args: any) => any> = Parameters<T>[0];

@Injectable()
export class UserService {
  private readonly repo = new UserRepository();

  findOne(params: Parameter<UserRepository['findOne']>) {
    return this.repo.findOne(params);
  }

  async insertOne(user: AuthDto.LocalSignUp.RequestBody) {
    return this.repo.insert({
      ...user,
      password: user.password && await bcrypt.hash(user.password, 10),
      role: role.NEWBIE,
      latestAccessAt: dayjs().toDate(),
      createdAt: dayjs().toDate(),
    });
  }
}
