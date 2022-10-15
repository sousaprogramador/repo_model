import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { OffersCategory } from '../../database/models/offersCategories.entity';

@Injectable()
export class OffersCategoriesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<OffersCategory>
  ): Promise<Pagination<OffersCategory>> {
    return paginate<OffersCategory>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

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

  public async findById(id: number): Promise<OffersCategory> {
    return OffersCategory.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
