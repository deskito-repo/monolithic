import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import connection from './connection';

export const client = new Pool(connection);
export const db = drizzle(client, { schema });
