/* eslint-disable @typescript-eslint/no-namespace */
import {
  char, pgTable, timestamp, uniqueIndex, varchar,
} from 'drizzle-orm/pg-core';
import { userValidation } from '@global/validations/user.validation';
import { sessionValidation as v } from '@global/validations/session.validation';
import { relations } from 'drizzle-orm';
import { user } from './user.schema';

export const session = pgTable('user_sessions', {
  id: char('id', { length: v.id.len }).primaryKey(),
  userId: varchar('user_id', { length: userValidation.userId.max }).notNull(),
  atExpires: timestamp('at_expires').notNull(),
}, (session) => ({
  sessionIdIndex: uniqueIndex('session_id_index').on(session.id),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.id],
    references: [user.id],
  }),
}));
