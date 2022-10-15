import { Injectable } from '@nestjs/common';
import { Interest } from 'src/modules/database/models/interests.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class InterestsRepository {
  public async listAll(options: FindManyOptions<Interest>): Promise<Interest[]> {
    return Interest.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Interest>
  ): Promise<Pagination<Interest>> {
    return paginate<Interest>(
      getRepository(Interest),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }

  async findById(id: number): Promise<Interest> {
    return Interest.findOne(id);
  }

  async insert(model: Interest): Promise<Interest> {
    return Interest.save(model);
  }

  async update(model: Interest): Promise<Interest> {
    return Interest.save(model);
  }

  async remove(id: number): Promise<void> {
    await Interest.delete(id);
  }
}
