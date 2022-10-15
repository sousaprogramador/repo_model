import { Injectable, NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OffersCategoriesGroupsRepository } from '../repositories/offersCategoriesGroups';
import { OffersCategoriesGroups } from '../../database/models/offersCategoriesGroups.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindConditions, FindManyOptions } from 'typeorm';
import { PaginationQuery } from '../validators/common/paginationQuery';

@Injectable()
export class OffersCategoriesGroupsService {
  constructor(private offersCategoriesGroupsRepository: OffersCategoriesGroupsRepository) {}

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<OffersCategoriesGroups>;

    const where = {} as FindConditions<OffersCategoriesGroups>;

    where.status = true;

    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.offersCategoriesGroupsRepository.list(paginationOption, options);
    }

    return this.offersCategoriesGroupsRepository.listAll(options);
  }

  public async findById(offersCategoriesId: number): Promise<OffersCategoriesGroups> {
    const offerCategory = await this.offersCategoriesGroupsRepository.findById(offersCategoriesId);
    if (!offerCategory) throw new NotFoundException('not-found');

    return offerCategory;
  }
}
