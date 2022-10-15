import { Injectable, NotFoundException } from '@nestjs/common';
import { State } from 'src/modules/database/models/states.entity';

import { CountriesRepository } from 'src/modules/admin/repositories/countries';

import { StatesRepository } from '../repositories/states';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { City } from 'src/modules/database/models/cities.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
import { ListStates } from '../validators/states/get';

@Injectable()
export class StatesService {
  constructor(private statesRepository: StatesRepository, private countriesRepository: CountriesRepository) {}

  public async citiesByState(stateId: number): Promise<City[]> {
    const state = await this.statesRepository.findById(stateId);

    if (!state) throw new NotFoundException('state-not-found');

    return state.cities;
  }

  public async list(params: ListStates) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<State>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<State>;
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.statesRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.statesRepository.listAll(options);
  }

  public async save(model: State): Promise<State> {
    const country = await this.countriesRepository.findById(model.countryId);

    if (!country) throw new NotFoundException('country-invalid');

    if (model.id) return this.update(model);

    return this.create(model);
  }

  private async create(model: State): Promise<State> {
    try {
      const state = await this.statesRepository.insert(model);
      return state;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(stateId: number): Promise<State> {
    const state = await this.statesRepository.findById(stateId);
    if (!state) throw new NotFoundException('not-found');

    return state;
  }

  private async update(model: State): Promise<State> {
    const state = await this.statesRepository.findById(model.id);
    if (!state) throw new NotFoundException('not-found');

    return this.statesRepository.update(model);
  }

  public async remove(stateId: number): Promise<void> {
    const state = await this.statesRepository.findById(stateId);

    if (!state) {
      throw new NotFoundException('not-found');
    }

    return this.statesRepository.remove(stateId);
  }
}
