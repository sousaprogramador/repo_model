import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { FeedLike } from '../../database/models/feedLikes.entity';

@Injectable()
export class FeedLikesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<FeedLike>
  ): Promise<Pagination<FeedLike>> {
    return paginate<FeedLike>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<FeedLike[]> {
    return FeedLike.find();
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<FeedLike>
  ): Promise<Pagination<FeedLike>> {
    return paginate<FeedLike>(
      getRepository(FeedLike),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options
      }
    );
  }
  public async insert(model: FeedLike): Promise<FeedLike> {
    return FeedLike.save(model);
  }
  public async findOne(options: FindOneOptions<FeedLike>) {
    return FeedLike.findOne(options);
  }
  public async findById(id: number): Promise<FeedLike> {
    return FeedLike.findOne(id);
  }
  public async update(model: FeedLike): Promise<FeedLike> {
    return FeedLike.save(model);
  }
  public async remove(id: number): Promise<void> {
    await FeedLike.softRemove({ id } as FeedLike);
  }
}
