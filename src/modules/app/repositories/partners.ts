import { Injectable } from '@nestjs/common';
import { Partner } from 'src/modules/database/models/partners.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class PartnersRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Partner>
  ): Promise<Pagination<Partner>> {
    return paginate<Partner>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Partner[]> {
    return Partner.find({
      where: {
        status: true
      }
    });
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Partner>> {
    return paginate<Partner>(
      getRepository(Partner),
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
  async findById(id: number): Promise<Partner> {
    return Partner.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
