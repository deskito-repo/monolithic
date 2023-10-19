import {
  varchar, serial, pgTable, smallint, timestamp,
} from 'drizzle-orm/pg-core';
import { Session } from 'src/global/entities/Session';
import { Role, schema } from '../../global/entities/User';

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', {
    length: schema.userId.max,
  }).notNull(),
  role: smallint('role').$type<Role>().notNull(),
  expires: timestamp('expires_date_time').notNull(),
} satisfies Record<keyof Session, any>);
