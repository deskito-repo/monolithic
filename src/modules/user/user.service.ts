import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as API from 'src/global/APIs/user.api';
import { User, role } from 'src/global/entities/User';
import * as bcrypt from 'bcryptjs';
import dayjs = require('dayjs');
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getOneUserAfterVerify(visitor: Pick<User, 'userId' | 'password'>) {
    const user = await this.userRepository.getByUserId(visitor.userId);
    const isLegal = await bcrypt.compare(visitor.password, user.password);
    if (isLegal === false) {
      const message = 'illegal password (possibly suspected problem something)';
      const trace = [visitor.password];
      throw new UnauthorizedException(trace, message);
    }
    return user;
  }

  async isExistUserId(userId: string) {
    const isExist = await this.userRepository.isExistUserId(userId);
    if (isExist) {
      throw new ConflictException();
    }
    return true;
  }

  async insertOne(user: API.InsertOne.Request) {
    const hashed = await bcrypt.hash(user.password, 10);
    return this.userRepository.insertOne({
      ...user,
      password: hashed,
      role: role.NORMAL,
      signUpYMD: dayjs().format('YYMMDD'),
    });
  }

  async deleteOne(id: number) {
    return this.userRepository.deleteOne(id);
  }
}
