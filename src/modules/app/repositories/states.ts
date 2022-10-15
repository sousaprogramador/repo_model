import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { State } from 'src/modules/database/models/states.entity';
import { getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class StatesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<State>
  ): Promise<Pagination<State>> {
    return paginate<State>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<State[]> {
    return State.find();
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<State>> {
    return paginate<State>(
      getRepository(State),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['country']
      }
    );
  }

  public async findById(id: number): Promise<State> {
    return State.findOne(id, {
      relations: ['country']
    });
  }
}
