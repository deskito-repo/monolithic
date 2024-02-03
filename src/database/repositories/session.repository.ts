/* eslint-disable no-await-in-loop */
import { eq, gt } from 'drizzle-orm';
import dayjs = require('dayjs');
import db from '../db';
import { session } from '../schema/session.schema';
import { user } from '../schema';

export class SessionRepository {
  async getOne(id: string) {
    return db.query.session.findFirst({
      where: eq(session.id, id),
    });
  }

  /**
   * @return {string} id sessionId
   */
  async setOne(params: typeof session.$inferInsert) {
    return db.transaction(async (tx) => {
      await tx
        .update(user)
        .set({ lastAccessDate: dayjs().toDate() })
        .where(eq(user.id, params.userId));
      const [{ id }] = await tx.insert(session).values(params).onConflictDoUpdate({
        target: session.id,
        set: params,
      })
        .returning();
      return {
        id,
      };
    });
  }

  async deleteOne(id: string) {
    return db.delete(session).where(eq(session.id, id));
  }

  async deleteExpiresAll() {
    return db.delete(session).where(gt(session.atExpires, dayjs().toDate()));
  }
}
