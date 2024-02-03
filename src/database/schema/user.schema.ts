/* eslint-disable @typescript-eslint/no-namespace */
import { type User } from '@global/entities/User.entity';
import { type SocialProvider } from '@global/enums/SocialProvider';
import { type Role, role } from '@global/enums/UserRole';
import { userValidation } from '@global/validations/user.validation';
import { relations } from 'drizzle-orm';
import {
  char,
  pgTable, smallint, timestamp, uniqueIndex, varchar,
} from 'drizzle-orm/pg-core';
//
namespace Table {
  export type users = Pick<User, 'id' | 'role' | 'nickname' | 'lastAccessDate'>;
  export type userDetails = Pick<User, 'id' | 'name' | 'phoneNumber' | 'signUpDate' | 'socialProvider'>;
  export type userSecrets = Pick<User, 'id' | 'password'>;
}
const v = userValidation;
export const user = pgTable('users', {
  id: varchar('id', { length: v.userId.max }).primaryKey(),
  role: smallint('role').$type<Role>().default(role.NEWBIE).notNull(),
  nickname: varchar('nickname', {
    length: v.nickname.max,
  }).notNull().unique(),
  lastAccessDate: timestamp('last_access_date').notNull(),
} satisfies Record<keyof Table.users, unknown>, (user) => ({
  userIdIndex: uniqueIndex('user_id_index').on(user.id),
}));
export const userDetail = pgTable('user_details', {
  id: varchar('id', { length: v.userId.max }).notNull().unique(),
  name: varchar('name', {
    length: v.name.max,
  }),
  phoneNumber: varchar('phone_number', {
    length: v.phoneNumber.max,
  }),
  signUpDate: timestamp('sign_up_date').notNull(),
  socialProvider: smallint('social_provider').$type<SocialProvider>(),
} satisfies Record<keyof Table.userDetails, unknown>, (user) => ({
  userIdIndex: uniqueIndex('user_detail_id_index').on(user.id),
}));
const BCRYPT_HASH_LENGTH = 60;
export const userSecret = pgTable('user_secrets', {
  id: varchar('id', { length: v.userId.max }).notNull().unique(),
  password: char('password', {
    length: BCRYPT_HASH_LENGTH,
  }),
} satisfies Record<keyof Table.userSecrets, unknown>, (user) => ({
  userIdIndex: uniqueIndex('user_secret_id_index').on(user.id),
}));

export const userRelations = relations(user, ({ one }) => ({
  detail: one(userDetail, {
    fields: [user.id],
    references: [userDetail.id],
  }),
  secret: one(userSecret, {
    fields: [user.id],
    references: [userSecret.id],
  }),
}));
