/* eslint-disable no-await-in-loop */
import {
  Injectable, Inject, Logger,
} from '@nestjs/common';
import type { Lucia } from 'lucia';

@Injectable()
export class SessionService {
  constructor(@Inject('Lucia') private readonly lucia: Lucia) { /** */ }

  private readonly logger = new Logger(SessionService.name);

  async validate(id: string) {
    const { session } = await this.lucia.validateSession(id);
    this.logger.log('session: ', session);
    return { session };
  }

  async generate(userId: string) {
    this.logger.log('session generated user:', userId);
    const session = await this.lucia.createSession(userId, {});
    return session;
  }

  async logoutOne(sessionId: string) {
    await this.lucia.invalidateSession(sessionId);
  }

  async logoutAllById(userId: string) {
    await this.lucia.invalidateUserSessions(userId);
  }

  async destroyExpires() {
    return this.lucia.deleteExpiredSessions();
  }
}
