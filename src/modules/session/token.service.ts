import { Role } from '@global/enums/UserRole';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/types/Token.type';
import { type UserEntity } from '@global/entities/User.entity';
import { ACCESS_TOKEN_EXPIRES } from './session.constant';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) { /** */ }

  async generate({
    userId,
    nickname,
    role,
    sessionId,
  }: {
    userId: UserEntity['id'];
    nickname: string;
    role: Role,
    sessionId: string;
  }) {
    const accessUser = { nickname, userId, role };
    const payload = { userId, role } satisfies AccessToken;
    const accessToken = await this.jwtService.signAsync(payload satisfies AccessToken, { expiresIn: ACCESS_TOKEN_EXPIRES / 1000 });
    const refreshToken = sessionId;
    return {
      accessUser,
      accessToken,
      refreshToken,
    };
  }

  verify<Token extends object>(token: string): Promise<Token> {
    return this.jwtService.verifyAsync<Token>(token);
  }

  decode<Token extends object>(token: string): Token {
    return this.jwtService.decode(token) as Token;
  }
}
