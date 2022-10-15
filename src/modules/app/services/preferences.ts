import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Preference } from 'src/modules/database/models/preferences.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PreferencesRepository } from '../repositories/preferences';
import { PaginationQuery } from '../validators/common/paginationQuery';

@Injectable()
export class PreferencesService {
  logger: Logger;
  constructor(private preferencesRepository: PreferencesRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.preferencesRepository.list(paginationOption);
    }
    // Outras opções de search
    return this.preferencesRepository.listAll();
  }

  public async findById(preferencesId: number): Promise<Preference> {
    const preference = await this.preferencesRepository.findById(preferencesId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }
}
