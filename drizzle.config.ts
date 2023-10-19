import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

export default {
  schema: './src/database/schema',
  out: './.cache/.migrations',
  breakpoints: true,
  driver: 'pg',
  dbCredentials: {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME || '',
    host: DB_HOST || 'localhost',
    port: Number(DB_PORT) || 0,
  },
} satisfies Config;
