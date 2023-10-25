import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import db from 'src/database/db';
import { sessions } from 'src/database/schema/session';
import * as API from '@app/global/APIs/session.api';
import dayjs = require('dayjs');

@Injectable()
export class SessionRepository {
  async getOne(id: number): Promise<API.GetOne.Response> {
    const [record] = await db
      .select()
      .from(sessions)
      .where(
        eq(sessions.id, id),
      )
      .limit(1);
    if (record === undefined) {
      throw new NotFoundException();
    }
    return record;
  }

  async insertOne(params: API.InsertOne.Request): Promise<API.InsertOne.Response> {
    const [record] = await db
      .insert(sessions)
      .values({
        ...params,
        expires: dayjs().add(1, 'month').toDate(),
      })
      .returning();
    return record;
  }

  async deleteOne(id: number) {
    return db
      .delete(sessions)
      .where(
        eq(sessions.id, id),
      );
  }
}
