import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Country } from 'src/modules/database/models/countries.entity';
import { State } from 'src/modules/database/models/states.entity';
import { FindConditions, FindManyOptions } from 'typeorm';

import { CountriesRepository } from '../repositories/countries';
import { ListCountries } from '../validators/countries/get';

@Injectable()
export class CountriesService {
  constructor(private countriesRepository: CountriesRepository) {}

  public async statesByCountry(countryId: number): Promise<State[]> {
    const country = await this.countriesRepository.findById(countryId);

    if (!country) throw new NotFoundException('country-not-found');

    return country.states;
  }

  public async findAll(params: ListCountries) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Country>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Country>;
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.countriesRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.countriesRepository.listAll(options);
  }

  public async save(model: Country): Promise<Country> {
    if (model.id) return this.update(model);

    return this.create(model);
  }

  private async create(model: Country): Promise<Country> {
    try {
      const country = await this.countriesRepository.insert(model);
      return country;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async update(model: Country): Promise<Country> {
    const country = await this.countriesRepository.findById(model.id);

    if (!country) throw new NotFoundException('not-found');

    return this.countriesRepository.update(model);
  }

  public async findById(id: number): Promise<Country> {
    const country = await this.countriesRepository.findById(id);

    if (!country) throw new NotFoundException('not-found');

    return country;
  }

  public async remove(countryId: number): Promise<void> {
    const country = await this.countriesRepository.findById(countryId);

    if (!country) {
      throw new NotFoundException('not-found');
    }

    return this.countriesRepository.remove(countryId);
  }
}
