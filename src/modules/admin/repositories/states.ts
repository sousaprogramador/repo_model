import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { State } from 'src/modules/database/models/states.entity';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class StatesRepository {
  public async listAll(options: FindManyOptions<State>): Promise<State[]> {
    return State.find({
      relations: ['country'],
      ...options
    });
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<State>
  ): Promise<Pagination<State>> {
    return paginate<State>(
      getRepository(State),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['country'],
        ...options
      }
    );
  }

  public async insert(model: State): Promise<State> {
    return State.save(model);
  }

  public async findById(id: number): Promise<State> {
    return State.findOne(id, {
      relations: ['country']
    });
  }

  public async update(model: State): Promise<State> {
    return State.save(model);
  }

  public async remove(id: number): Promise<void> {
    await State.delete(id);
  }
}
