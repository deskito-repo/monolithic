import { Injectable } from '@nestjs/common';
import * as API from '@app/global/APIs/session.api';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async insertOne(params: API.InsertOne.Request) {
    return this.sessionRepository.insertOne(params);
  }

  async deleteOne(id: number) {
    await this.sessionRepository.deleteOne(id);
  }
}
