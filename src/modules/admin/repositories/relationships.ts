import { Injectable } from '@nestjs/common';
import { Relationship } from 'src/modules/database/models/relationships.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class RelationshipsRepository {
  public async listAll(options: FindManyOptions<Relationship>): Promise<Relationship[]> {
    return Relationship.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Relationship>
  ): Promise<Pagination<Relationship>> {
    return paginate<Relationship>(
      getRepository(Relationship),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  async findById(id: number): Promise<Relationship> {
    return Relationship.findOne(id);
  }

  async insert(model: Relationship): Promise<Relationship> {
    return Relationship.save(model);
  }

  async update(model: Relationship): Promise<Relationship> {
    return Relationship.save(model);
  }

  async remove(id: number): Promise<void> {
    await Relationship.delete(id);
  }
}
