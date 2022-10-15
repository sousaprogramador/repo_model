import { Injectable } from '@nestjs/common';
import { Interest } from 'src/modules/database/models/interests.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class InterestsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Interest>
  ): Promise<Pagination<Interest>> {
    return paginate<Interest>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Interest>> {
    return paginate<Interest>(
      getRepository(Interest),
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

  public async listAll(): Promise<Interest[]> {
    return Interest.find({
      where: {
        status: true
      }
    });
  }

  async findById(id: number): Promise<Interest> {
    return Interest.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
