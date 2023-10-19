import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/global/entities/AccessToken';
import { RefreshToken } from 'src/global/entities/RefreshToken';
import { User } from 'src/global/entities/User';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens({
    userId, nickname, role, sessionId,
  }: User & { sessionId: number }) {
    const accessToken = { nickname, role } satisfies AccessToken;
    const refreshToken = { userId, sessionId } satisfies RefreshToken;
    return {
      accessToken: await this.jwtService.signAsync(accessToken satisfies AccessToken, { expiresIn: '2h' }),
      refreshToken: await this.jwtService.signAsync(refreshToken, { expiresIn: '4w' }),
    };
  }
}
