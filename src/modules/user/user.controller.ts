import {
  Controller, Delete, Get, Param,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/exists/:userId')
  async isExist(@Param('userId') userId: string) {
    return this.userService.isExistUserId(userId);
  }

  @Delete()
  async deleteAsSelf() {
    // return this.userService.deleteOne();
  }
}
