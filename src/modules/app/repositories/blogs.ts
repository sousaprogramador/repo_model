import { Injectable } from '@nestjs/common';
import { Blog } from 'src/modules/database/models/blogs.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class BlogsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Blog>
  ): Promise<Pagination<Blog>> {
    return paginate<Blog>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Blog[]> {
    return Blog.find({
      where: {
        status: true
      }
    });
  }

  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Blog>> {
    const queryBuilder = Blog.createQueryBuilder().where('deletedAt is null').andWhere('status = true');
    // outras verificações

    return paginate<Blog>(queryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  async findById(id: number): Promise<Blog> {
    return Blog.findOne(id, {
      relations: ['destinations'],
      where: {
        status: true
      }
    });
  }
}
