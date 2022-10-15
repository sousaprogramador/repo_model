import { Injectable } from '@nestjs/common';
import { Term } from 'src/modules/database/models/terms.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder, FindManyOptions } from 'typeorm';

@Injectable()
export class TermsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Term>
  ): Promise<Pagination<Term>> {
    return paginate<Term>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Term[]> {
    return Term.find({
      where: {
        status: true
      }
    });
  }

  public async list(paginationOptions: IPaginationOptions, params?: FindManyOptions<Term>): Promise<Pagination<Term>> {
    return paginate<Term>(
      getRepository(Term),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...params,
        where: {
          status: true
        }
      }
    );
  }
  async findById(id: number): Promise<Term> {
    return Term.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
