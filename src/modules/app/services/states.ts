import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { State } from 'src/modules/database/models/states.entity';

import { CountriesRepository } from 'src/modules/app/repositories/countries';

import { StatesRepository } from '../repositories/states';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { City } from 'src/modules/database/models/cities.entity';

@Injectable()
export class StatesService {
  logger: Logger;
  constructor(private statesRepository: StatesRepository, private countriesRepository: CountriesRepository) {
    this.logger = new Logger();
  }

  public async citiesByState(stateId: number): Promise<City[]> {
    const state = await this.statesRepository.findById(stateId);

    if (!state) throw new NotFoundException('state-not-found');

    return state.cities;
  }

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.statesRepository.list(paginationOption);
    }
    // Outras opções de search
    return this.statesRepository.listAll();
  }

  public async findById(stateId: number): Promise<State> {
    const state = await this.statesRepository.findById(stateId);
    if (!state) throw new NotFoundException('not-found');

    return state;
  }
}
