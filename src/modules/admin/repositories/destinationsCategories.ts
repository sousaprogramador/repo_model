import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
import { DestinationsCategory } from '../../database/models/destinationsCategories.entity';

@Injectable()
export class DestinationsCategoriesRepository {
  public async listAll(options: FindManyOptions<DestinationsCategory>): Promise<DestinationsCategory[]> {
    return DestinationsCategory.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<DestinationsCategory>
  ): Promise<Pagination<DestinationsCategory>> {
    return paginate<DestinationsCategory>(
      getRepository(DestinationsCategory),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  public async insert(model: DestinationsCategory): Promise<DestinationsCategory> {
    return DestinationsCategory.save(model);
  }
  public async findById(id: number): Promise<DestinationsCategory> {
    return DestinationsCategory.findOne(id);
  }
  public async update(model: DestinationsCategory): Promise<DestinationsCategory> {
    return DestinationsCategory.save(model);
  }
  public async remove(id: number): Promise<void> {
    await DestinationsCategory.delete(id);
  }
}
