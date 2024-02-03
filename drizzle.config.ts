import type { Config } from 'drizzle-kit';

const {
  DB_HOST: host = 'localhost',
  DB_USER: user,
  DB_PASSWORD: password,
  DB_NAME: database = 'db',
  DB_PORT,
} = process.env;

export default {
  schema: './src/database/schema',
  out: './.cache/.migrations',
  breakpoints: true,
  driver: 'pg',
  dbCredentials: {
    user,
    password,
    host,
    database,
    port: Number(DB_PORT) || 0,
  },
} satisfies Config;
