import type { Config } from 'drizzle-kit';
import connection from 'src/database/connection';

export default {
  schema: './src/database/schema',
  out: './.cache/.migrations',
  breakpoints: true,
  driver: 'pg',
  dbCredentials: connection,
} satisfies Config;
