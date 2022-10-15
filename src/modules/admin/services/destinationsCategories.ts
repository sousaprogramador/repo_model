import { Injectable, NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DestinationsCategoriesRepository } from './../repositories/destinationsCategories';
import { DestinationsCategory } from '../../database/models/destinationsCategories.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ListDestinationCategories } from '../validators/destinationsCategories/get';
import { FindConditions, FindManyOptions } from 'typeorm';

@Injectable()
export class DestinationsCategoriesService {
  constructor(private destinationsCategoriesRepository: DestinationsCategoriesRepository) {}

  public async list(params: ListDestinationCategories) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<DestinationsCategory>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<DestinationsCategory>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.destinationsCategoriesRepository.list(paginationOption, options);
    }

    return this.destinationsCategoriesRepository.listAll(options);
  }

  public async save(model: DestinationsCategory): Promise<DestinationsCategory> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: DestinationsCategory): Promise<DestinationsCategory> {
    try {
      const DestinationsCategory = await this.destinationsCategoriesRepository.insert(model);
      return DestinationsCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async update(model: DestinationsCategory): Promise<DestinationsCategory> {
    const DestinationsCategory = await this.destinationsCategoriesRepository.findById(model.id);
    if (!DestinationsCategory) throw new NotFoundException('not-found');

    return this.destinationsCategoriesRepository.update(model);
  }

  public async findById(destinationsCategoriesId: number): Promise<DestinationsCategory> {
    const destinationCategory = await this.destinationsCategoriesRepository.findById(destinationsCategoriesId);
    if (!destinationCategory) throw new NotFoundException('not-found');

    return destinationCategory;
  }

  public async remove(destinationsCategoriesId: number): Promise<void> {
    const lead = await this.destinationsCategoriesRepository.findById(destinationsCategoriesId);

    if (!lead) {
      throw new NotFoundException('not-found');
    }

    return this.destinationsCategoriesRepository.remove(destinationsCategoriesId);
  }
}
