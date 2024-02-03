import { desc, eq, sql } from 'drizzle-orm';
import { FindMany, FindOne } from '@global/DTOs/user.dto';
import { UserEntity } from '@global/entities/User.entity';
import { getMatchedObject } from '@global/utils/getMatchedObject';
import { SetOptional } from 'type-fest';
import dayjs = require('dayjs');
import db from '../db';
import { user, userDetail, userSecret } from '../schema/user.schema';

type UpdatedUser = SetOptional<UserEntity, keyof Omit<UserEntity, 'id'>>;

export class UserRepository {
  async findMany({ page, count }: FindMany.RequestQuery): Promise<FindMany.Response> {
    const offset = (page - 1) * count;
    const limit = page * count;

    return db.query.user.findMany({
      extras: {
        count: sql<number>`count(*) over()`.as('count'),
      },
      offset,
      limit,
      orderBy: desc(user.id),
    })
      .then((records) => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        list: records.map(({ count: _, ...record }) => record),
        count: records[0] ? records[0].count : 0,
      }));
  }

  async findOne(props: FindOne.RequestQuery) {
    const [[searchBy, searchValue]] = Object.entries(props);
    const getWhere = (value: any) => {
      const column = searchBy in user ? user[searchBy as keyof typeof user.$inferSelect] : userDetail[searchBy as keyof typeof userDetail.$inferSelect];
      return eq(column, value);
    };
    return db.query.user.findFirst({
      with: {
        detail: true,
        secret: true,
      },
      where: getWhere(searchValue),
    })
      .then((record) => {
        if (!record) {
          return undefined;
        }
        const { detail, secret, ...user } = record;
        return {
          ...detail,
          ...secret,
          ...user,
        };
      });
  }

  async insert<Params extends UserEntity | UserEntity[]>(params: Params) {
    return db.transaction(async (tx) => {
      const insertOne = async (params: UserEntity) => {
        const [basic] = await tx.insert(user).values({
          ...params,
          lastAccessDate: dayjs().toDate(),
        })
          .returning();
        const [detail] = await tx
          .insert(userDetail)
          .values({ ...getMatchedObject(params, userDetail), id: basic.id })
          .returning();
        const [secret] = await tx
          .insert(userSecret)
          .values({ ...getMatchedObject(params, userSecret), id: basic.id })
          .returning();
        return {
          ...basic,
          ...detail,
          ...secret,
        };
      };
      if (Array.isArray(params)) {
        return Promise.all(
          params.map(insertOne),
        );
      }
      return insertOne(params);
    }) as Promise<Params extends UserEntity[] ? UserEntity[] : UserEntity>;
  }

  async update(params: UpdatedUser | UpdatedUser[]) {
    db.transaction(async (tx) => {
      const updateOne = async (params: UpdatedUser) => {
        await tx.update(user).set(getMatchedObject(params, user)).where(eq(user.id, params.id));
        await tx.update(userDetail).set(getMatchedObject(params, userDetail)).where(eq(userDetail.id, params.id));
        await tx.update(userSecret).set(getMatchedObject(params, userSecret)).where(eq(userSecret.id, params.id));
      };
      if (Array.isArray(params)) {
        return Promise.all(
          params.map(updateOne),
        );
      }
      return updateOne(params);
    });
  }
}
