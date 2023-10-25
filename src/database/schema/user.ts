import {
  varchar, serial, pgTable, smallint, integer,
} from 'drizzle-orm/pg-core';
import { Role, schema } from '../../../apps/global/entities/User';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', {
    length: schema.userId.max,
  }).notNull().unique(),
  role: smallint('role').$type<Role>().notNull(),
  nickname: varchar('nickname', {
    length: schema.nickname.max,
  }).notNull().unique(),
});
export const usersDetail = pgTable('users_detail', {
  id: integer('id').notNull(),
  name: varchar('name', {
    length: schema.name.max,
  }).notNull(),
  phoneNumber: varchar('phone_number', {
    length: schema.phoneNumber.max,
  }).notNull(),
  signUpYMD: varchar('sign_up_ymd_date', {
    length: schema.signUpYMD.max,
  }).notNull(),
});

const BCRYPT_HASH_LENGTH = 60;
export const usersSecret = pgTable('users_secret', {
  id: integer('id').notNull(),
  password: varchar('password', {
    length: BCRYPT_HASH_LENGTH,
  }).notNull(),
});

export const userSocial = pgTable('users_social', {
  id: integer('id').notNull(),
  mail: varchar('mail', {
    length: 30,
  }).notNull(),
  socialType: smallint('type').notNull(),
});
export const session = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userIdx: integer('user_idx').notNull(),
});
