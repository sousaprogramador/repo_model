import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

import { databaseProviders } from './database.providers';

@Module({
  imports: [],
  providers: [DatabaseService, ...databaseProviders],
  exports: [DatabaseService, ...databaseProviders]
})
export class DatabaseModule {}
