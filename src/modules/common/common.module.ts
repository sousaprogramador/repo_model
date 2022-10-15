import { Module } from '@nestjs/common';
import { AwsController } from './controllers/aws';
import { HealthController } from './controllers/health';
import { UsersRepository } from './controllers/repositories/users';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './role.guard';
import { AwsService } from './services/aws';
import { CacheService } from './services/cache';
import { ConfigService } from './services/config';
import { RDStationService } from './services/rdstation';

@Module({
  controllers: [HealthController, AwsController],
  providers: [JwtStrategy, RolesGuard, AwsService, ConfigService, UsersRepository, CacheService, RDStationService],
  exports: [AwsService, RDStationService, CacheService]
})
export class CommonModule {}
