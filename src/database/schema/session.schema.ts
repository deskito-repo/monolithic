import {
  text, pgTable, timestamp, uniqueIndex, varchar,
} from 'drizzle-orm/pg-core';
import { sessionMeta as meta, type Session } from 'global/entities/session.entity';
import { relations } from 'drizzle-orm';
import { user } from './user.schema';

export const session = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: varchar('user_id').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
} satisfies Record<keyof Session, any>, (session) => ({
  sessionIdIndex: uniqueIndex('session_id_index').on(session.id),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.id],
    references: [user.id],
  }),
}));
