import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
import { OffersCategory } from '../../database/models/offersCategories.entity';

@Injectable()
export class OffersCategoriesRepository {
  public async listAll(options: FindManyOptions<OffersCategory>): Promise<OffersCategory[]> {
    return OffersCategory.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<OffersCategory>
  ): Promise<Pagination<OffersCategory>> {
    return paginate<OffersCategory>(
      getRepository(OffersCategory),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }

  public async insert(model: OffersCategory): Promise<OffersCategory> {
    return OffersCategory.save(model);
  }

  public async findById(id: number): Promise<OffersCategory> {
    return OffersCategory.findOne(id);
  }

  // public async update(model: OffersCategory): Promise<OffersCategory> {
  //   return OffersCategory.save(model);
  // }

  public async update(model: { id: number } & Partial<OffersCategory>): Promise<OffersCategory> {
    const updatedOffersCategory = await getRepository(OffersCategory)
      .createQueryBuilder()
      .update(OffersCategory, model)
      .where('offersCategories.id = :id', { id: model.id })
      .updateEntity(true)
      .execute();

    if (updatedOffersCategory.affected !== 1) return;

    const foundOffersCategory = await getRepository(OffersCategory).findOne(model.id);
    return foundOffersCategory;
  }

  public async remove(id: number): Promise<void> {
    await OffersCategory.delete(id);
  }
}
