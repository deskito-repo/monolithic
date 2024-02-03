import { migrate } from 'drizzle-orm/node-postgres/migrator';
import db from './db';

migrate(db, { migrationsFolder: './.cache/.migrations' });
