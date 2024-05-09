import { db } from 'src/database/db';
import { user, session } from 'src/database/schema';
import { dynamicImport } from 'tsimportlib';

const luciaProvider = {
  provide: 'Lucia',
  inject: [],
  useFactory: async () => {
    const { Lucia, TimeSpan } = await dynamicImport('lucia', module) as typeof import('lucia');
    const { DrizzlePostgreSQLAdapter: Adapter } = await dynamicImport('@lucia-auth/adapter-drizzle', module) as typeof import('@lucia-auth/adapter-drizzle');
    const adapter = new Adapter(db, session, user);
    const twoWeeks = new TimeSpan(2, 'w');
    return new Lucia(adapter, {
      sessionExpiresIn: twoWeeks,
    });
  },
};

export default luciaProvider;
