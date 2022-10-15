import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Config } from 'src/modules/database/models/config.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class ConfigService {
  logger: Logger;
  constructor() {
    this.logger = new Logger('ConfigService');
  }

  async getMinVersionApp() {
    try {
      const min_app_version = await Config.findOne({
        where: {
          name: 'min_app_version'
        }
      });

      const description = await Config.findOne({
        where: {
          name: 'status_description'
        }
      });

      const title = await Config.findOne({
        where: {
          name: 'status_title'
        }
      });

      if (!min_app_version) throw new BadRequestException('config-not-found');

      return {
        version: min_app_version.value,
        description: description?.value || '',
        title: title?.value || ''
      };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-get-min-version');
    }
  }

  async getConfig() {
    try {
      const configuration = await Config.find({
        select: ['name', 'value'],
        where: { deletedAt: IsNull() }
      });

      return configuration;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-get-config');
    }
  }
}
