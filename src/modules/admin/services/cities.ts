import { Injectable, NotFoundException } from '@nestjs/common';
import { City } from 'src/modules/database/models/cities.entity';

import { StatesRepository } from 'src/modules/admin/repositories/states';

import { CitiesRepository } from '../repositories/cities';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ListCities } from '../validators/cities/get';
import { FindConditions, FindManyOptions } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(private citiesRepository: CitiesRepository, private statesRepository: StatesRepository) {}

  public async list(params: ListCities) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<City>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<City>;
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.citiesRepository.list(paginationOption, options);
    }
    // Outras opções de search

    return this.citiesRepository.listAll(options);
  }

  public async save(model: City): Promise<City> {
    const state = await this.statesRepository.findById(model.stateId);

    if (!state) throw new NotFoundException('state-invalid');

    if (model.id) return this.update(model);

    return this.create(model);
  }

  private async create(model: City): Promise<City> {
    try {
      const city = await this.citiesRepository.insert(model);
      return city;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(cityId: number): Promise<City> {
    const city = await this.citiesRepository.findById(cityId);
    if (!city) throw new NotFoundException('not-found');

    return city;
  }

  private async update(model: City): Promise<City> {
    const state = await this.statesRepository.findById(model.stateId);

    if (!state) throw new NotFoundException('state-not-found');

    return this.citiesRepository.update(model);
  }

  public async remove(cityId: number): Promise<void> {
    const city = await this.citiesRepository.findById(cityId);

    if (!city) {
      throw new NotFoundException('not-found');
    }

    return this.citiesRepository.remove(cityId);
  }

  public async findByName(name: string): Promise<City> {
    const city = await this.citiesRepository.findOne({ name });

    if (!city) throw new NotFoundException('not-found');

    return city;
  }
}
