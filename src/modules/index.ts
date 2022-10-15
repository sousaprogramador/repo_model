import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { AdminModule } from './admin/admin.module';
import { AppModule } from './app/app.module';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [
    RouterModule.forRoutes([
      { path: '', module: CommonModule },
      { path: '/admin', module: AdminModule },
      { path: '/app', module: AppModule }
    ]),
    AppModule,
    AdminModule,
    CommonModule,
    TaskModule
  ]
})
export class ApplicationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
