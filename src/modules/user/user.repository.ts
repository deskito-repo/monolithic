import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import db from 'src/database/db';
import { users, usersDetail, usersSecret } from 'src/database/schema/user';
import * as API from '@app/global/APIs/user.api';
import { role } from '@app/global/entities/User';

@Injectable()
export class UserRepository {
  async isExistUserId(userId: string) {
    const [record] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    return record !== undefined;
  }

  private getSelectQuery() {
    return db
      .select()
      .from(users)
      .innerJoin(usersDetail, eq(users.id, usersDetail.id));
  }

  async getById(id: number) {
    const [record] = await this
      .getSelectQuery()
      .where(eq(users.id, id));
    if (record === undefined) {
      throw new NotFoundException();
    }
    return {
      ...record.users,
      ...record.users_detail,
    };
  }

  async getByUserId(userId: string) {
    const [record] = await this
      .getSelectQuery()
      .innerJoin(usersSecret, eq(users.id, usersSecret.id))
      .where(
        eq(users.userId, userId),
      );
    console.log(record); /* @DELETE  */
    if (record === undefined) {
      throw new NotFoundException();
    }
    return {
      ...record.users,
      ...record.users_detail,
      ...record.users_secret,
    };
  }

  async insertOne(params: API.InsertOne.Request & { signUpYMD: string }) {
    return db.transaction(async (tx) => {
      const {
        nickname, userId, password, ...restParams
      } = params;
      const [{ id }] = await tx
        .insert(users)
        .values({ nickname, role: role.NORMAL, userId }).returning();
      await tx
        .insert(usersSecret)
        .values({ id, password });
      await tx
        .insert(usersDetail)
        .values({ id, ...restParams });
      return { id };
    });
  }

  async compare(form: { userId: string; hashed: string }) {
    const [record] = await db
      .select()
      .from(users)
      .innerJoin(usersSecret, eq(users.id, usersSecret.id))
      .where(eq(users.userId, form.userId));
    if (record === undefined) {
      throw new NotFoundException();
    }
    const user = {
      ...record.users,
      ...record.users_secret,
    };
    // const isLegal = await bcrypt.compare(form.hashed, user.password);
    // return isLegal;
  }

  async deleteOne(id: number) {
    return db.transaction(async (tx) => {
      await tx
        .delete(users)
        .where(eq(users.id, id));
      await tx
        .delete(usersSecret)
        .where(eq(usersSecret.id, id));
      await tx
        .delete(usersDetail)
        .where(eq(usersDetail.id, id));
    });
  }
}
