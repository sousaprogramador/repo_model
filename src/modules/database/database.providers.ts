import { createConnection, getConnectionOptions } from 'typeorm';

import { IS_DEV } from '../../settings';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const options = await getConnectionOptions(); // pega do ENV
      // options.connectTimeout = 10000; // in ms
      // options.acquireTimeout = 10000; // in ms
      // options.maxQueryExecutionTime = 10000; // in ms
      // options.cache = true;

      return await createConnection({
        ...options,
        extra: {
          charset: 'utf8mb4_unicode_ci'
        },
        entities: [__dirname + '/models/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: IS_DEV ? ['query', 'error'] : false
      });
    }
  }
];
