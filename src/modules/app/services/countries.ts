import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Country } from 'src/modules/database/models/countries.entity';
import { State } from 'src/modules/database/models/states.entity';

import { CountriesRepository } from '../repositories/countries';
import { PaginationQuery } from '../validators/common/paginationQuery';

@Injectable()
export class CountriesService {
  logger: Logger;
  constructor(private countriesRepository: CountriesRepository) {
    this.logger = new Logger();
  }

  public async statesByCountry(countryId: number): Promise<State[]> {
    const country = await this.countriesRepository.findById(countryId);

    if (!country) throw new NotFoundException('country-not-found');

    return country.states;
  }

  public async findAll(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.countriesRepository.list(paginationOption);
    }
    // Outras opções de search
    return this.countriesRepository.listAll();
  }

  public async findById(id: number): Promise<Country> {
    const country = await this.countriesRepository.findById(id);

    if (!country) throw new NotFoundException('not-found');

    return country;
  }
}
