import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { Country } from 'src/modules/database/models/countries.entity';
import { SelectQueryBuilder } from 'typeorm';
@Injectable()
export class CountriesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Country>
  ): Promise<Pagination<Country>> {
    return paginate<Country>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Country[]> {
    return Country.find();
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Country>> {
    const queryBuilder = Country.createQueryBuilder('countries');
    // outras verificações

    return paginate<Country>(queryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async findById(id: number): Promise<Country> {
    return Country.findOne(id);
  }
}
