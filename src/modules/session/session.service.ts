/* eslint-disable no-await-in-loop */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SessionRepository } from 'src/database/repositories/session.repository';
import { nanoid } from 'nanoid';
import dayjs = require('dayjs');
import { sesionValidation as v } from '@global/validations/session.validation';
import { REFRESH_TOKEN_EXPIRES } from './session.constant';

@Injectable()
export class SessionService {
  private readonly repo = new SessionRepository();

  private readonly logger = new Logger(SessionService.name);

  /** @param {string} id sessionId */
  getOne(id: string) {
    return this.repo.getOne(id);
  }

  /** @param {string} id sessionId */
  async refresh(id: string): Promise<Record<'userId' | 'sessionId', string>> {
    const session = await this.getOne(id);
    if (!session) {
      this.logger.log('session is not exist');
      throw new UnauthorizedException();
    }
    await this.destroy(id);
    const { id: sessionId } = await this.setOne({ userId: session.userId });
    return { ...session, sessionId };
  }

  async setOne(params: {
    id?: string;
    userId: string;
  }) {
    const payload = {
      ...params,
      id: params.id || await this.generateUniqueId(),
      atExpires: dayjs().add(REFRESH_TOKEN_EXPIRES).toDate(),
    };
    return this.repo.setOne(payload);
  }

  /** @param {string} id sessionId */
  destroy(id: string) {
    return this.repo.deleteOne(id);
  }

  destroyExpires() {
    return this.repo.deleteExpiresAll();
  }

  private async generateUniqueId() {
    let id: string;
    do {
      id = nanoid(v.id.len);
    } while (await this.getOne(id) !== undefined);
    return id;
  }
}
