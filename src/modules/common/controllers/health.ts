import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '../services/config';
import { UsersRepository } from './repositories/users';
@ApiTags('Health Check')
@Controller()
export class HealthController {
  constructor(private configService: ConfigService, private usersRepository: UsersRepository) {}

  @Get('/')
  public async main() {
    return 'API Pinguim';
  }

  @Get('health')
  async health(): Promise<string> {
    const result = await this.usersRepository.count();
    if (result > 0) {
      return 'alive';
    }
    throw new Error('api-is-down');
  }

  @Get('app-version')
  @ApiResponse({ status: 200, description: 'Retorna a versão mínima do app' })
  async appVersion() {
    return this.configService.getMinVersionApp();
  }

  @Get('config')
  @ApiResponse({ status: 200, description: 'Retorna configurações públicas' })
  async config() {
    return this.configService.getConfig();
  }
}
