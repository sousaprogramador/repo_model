import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
import { OffersCategoriesGroups } from '../../database/models/offersCategoriesGroups.entity';

import { OffersCategoriesHasGroups } from '../../database/models/offersCategoriesHasGroups.entity';

@Injectable()
export class OffersCategoriesGroupsRepository {
  public async listAll(options: FindManyOptions<OffersCategoriesGroups>): Promise<OffersCategoriesGroups[]> {
    return OffersCategoriesGroups.find({
      ...options,
      relations: ['categories']
    });
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<OffersCategoriesGroups>
  ): Promise<Pagination<OffersCategoriesGroups>> {
    return paginate<OffersCategoriesGroups>(
      getRepository(OffersCategoriesGroups),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options,
        relations: ['categories']
      }
    );
  }
  public async insert(model: OffersCategoriesGroups): Promise<OffersCategoriesGroups> {
    return OffersCategoriesGroups.save(model);
  }
  public async findById(id: number): Promise<OffersCategoriesGroups> {
    return OffersCategoriesGroups.findOne(id, {
      relations: ['categories']
    });
  }
  public async update(model: OffersCategoriesGroups): Promise<OffersCategoriesGroups> {
    return OffersCategoriesGroups.save(model);
  }
  public async remove(id: number): Promise<void> {
    await OffersCategoriesGroups.delete(id);
  }

  public async deleteCategoriesByGroupId(groupId: number): Promise<void> {
    await OffersCategoriesHasGroups.delete({ groupId });
  }

  public async updateCategories(groupId: number, categoriesId: number[]): Promise<void> {
    categoriesId.map(async categoryId => {
      await OffersCategoriesHasGroups.insert({
        categoryId,
        groupId
      });
    });
  }
}
