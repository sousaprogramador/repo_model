import { Injectable } from '@nestjs/common';
import { Relationship } from 'src/modules/database/models/relationships.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class RelationshipsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Relationship>
  ): Promise<Pagination<Relationship>> {
    return paginate<Relationship>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Relationship[]> {
    return Relationship.find({
      where: {
        status: true
      }
    });
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Relationship>> {
    return paginate<Relationship>(
      getRepository(Relationship),
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
  async findById(id: number): Promise<Relationship> {
    return Relationship.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
