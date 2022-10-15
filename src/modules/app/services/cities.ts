import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { City } from 'src/modules/database/models/cities.entity';

import { StatesRepository } from 'src/modules/app/repositories/states';

import { CitiesRepository } from '../repositories/cities';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class CitiesService {
  logger: Logger;
  constructor(private citiesRepository: CitiesRepository, private statesRepository: StatesRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    try {
      const { page, limit } = params;

      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      return this.citiesRepository.list(paginationOption);

      // Outras opções de search

      // return this.citiesRepository.listAll();
    } catch (e) {
      this.logger.error('Error list CitiesService', e);
      throw new InternalServerErrorException('error-list-cities');
    }
  }

  public async findById(cityId: number): Promise<City> {
    try {
      const city = await this.citiesRepository.findById(cityId);
      if (!city) throw new NotFoundException('not-found');

      return city;
    } catch (e) {
      this.logger.error('Error findById CitiesService', e);
      throw new InternalServerErrorException('error-find-city');
    }
  }
}
