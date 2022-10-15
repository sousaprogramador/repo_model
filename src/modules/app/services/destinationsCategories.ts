import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DestinationsCategoriesRepository } from './../repositories/destinationsCategories';
import { DestinationsCategory } from '../../database/models/destinationsCategories.entity';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class DestinationsCategoriesService {
  logger: Logger;
  constructor(private destinationsCategoriesRepository: DestinationsCategoriesRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    try {
      const { page, limit } = params;
      const paginationOption: IPaginationOptions = {} as IPaginationOptions;
      // Outras opções de search

      if (page && limit) {
        paginationOption.page = page;
        paginationOption.limit = limit;
        return this.destinationsCategoriesRepository.list(paginationOption);
      }

      return this.destinationsCategoriesRepository.listAll();
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('list-destinations-categories-failed');
    }
  }

  public async findById(destinationsCategoriesId: number): Promise<DestinationsCategory> {
    const destinationCategory = await this.destinationsCategoriesRepository.findById(destinationsCategoriesId);
    if (!destinationCategory) throw new NotFoundException('not-found');

    return destinationCategory;
  }
}
