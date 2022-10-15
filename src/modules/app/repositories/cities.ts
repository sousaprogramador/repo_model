import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { City } from 'src/modules/database/models/cities.entity';
import { getRepository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class CitiesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<City>
  ): Promise<Pagination<City>> {
    return paginate<City>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<City[]> {
    return City.find({
      // where: {
      //   status: true
      // }
    });
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<City>> {
    return paginate<City>(
      getRepository(City),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        // where: {
        //   status: true
        // },
        relations: ['state']
      }
    );
  }

  public async findById(id: number): Promise<City> {
    return City.findOne(id, {
      // where: {
      //   status: true
      // },
      relations: ['state']
    });
  }
}
