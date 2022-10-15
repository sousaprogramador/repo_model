import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';
import { DestinationsCategory } from '../../database/models/destinationsCategories.entity';

@Injectable()
export class DestinationsCategoriesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<DestinationsCategory>
  ): Promise<Pagination<DestinationsCategory>> {
    return paginate<DestinationsCategory>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<DestinationsCategory[]> {
    return DestinationsCategory.find({
      where: {
        status: true
      }
    });
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<DestinationsCategory>> {
    return paginate<DestinationsCategory>(
      getRepository(DestinationsCategory),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        where: {
          status: true
        }
      }
    );
  }

  public async findById(id: number): Promise<DestinationsCategory> {
    return DestinationsCategory.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
