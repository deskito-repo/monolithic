import { desc, eq, sql } from 'drizzle-orm';
import * as UserDto from 'global/dtos/user.dto';
import { User } from 'global/entities/user.entity';
import { pickObjectProps } from 'global/utils/pickObjectProps';
import { SetOptional } from 'type-fest';
import dayjs = require('dayjs');
import { db } from '../db';
import { user, userDetail, userSecret } from '../schema/user.schema';

type UpdatedUser = SetOptional<User, keyof Omit<User, 'id'>>;

export class UserRepository {
  async findMany({ page, count }: UserDto.FindMany.RequestQuery): Promise<UserDto.FindMany.Response> {
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

  async findOne(props: UserDto.FindOne.RequestQuery): Promise<User | undefined> {
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

  async insert<Params extends User | User[]>(params: Params) {
    return db.transaction(async (tx) => {
      const insertOne = async (params: User) => {
        const [basic] = await tx.insert(user).values(params).returning();
        const [detail] = await tx
          .insert(userDetail)
          .values({
            ...pickObjectProps(params, userDetail),
            createdAt: dayjs().toDate(),
            id: basic.id,
          })
          .returning();
        const [secret] = await tx
          .insert(userSecret)
          .values({ ...pickObjectProps(params, userSecret), id: basic.id })
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
    }) as Promise<Params extends User[] ? User[] : User>;
  }

  async update(params: UpdatedUser | UpdatedUser[]) {
    db.transaction(async (tx) => {
      const updateOne = async (params: UpdatedUser) => {
        await tx.update(user).set(pickObjectProps(params, user)).where(eq(user.id, params.id));
        await tx.update(userDetail).set(pickObjectProps(params, userDetail)).where(eq(userDetail.id, params.id));
        await tx.update(userSecret).set(pickObjectProps(params, userSecret)).where(eq(userSecret.id, params.id));
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
