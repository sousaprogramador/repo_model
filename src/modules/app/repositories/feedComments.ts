import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { FeedComment } from '../../database/models/feedComments.entity';

@Injectable()
export class FeedCommentsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<FeedComment>
  ): Promise<Pagination<FeedComment>> {
    return paginate<FeedComment>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<FeedComment[]> {
    return FeedComment.find();
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<FeedComment>
  ): Promise<Pagination<FeedComment>> {
    return paginate<FeedComment>(
      getRepository(FeedComment),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options,
        relations: ['user']
      }
    );
  }
  public async insert(model: FeedComment): Promise<FeedComment> {
    const feedComment = await FeedComment.save(model);

    return FeedComment.findOne(feedComment.id, {
      relations: ['user']
    });
  }

  public async findById(id: number): Promise<FeedComment> {
    return FeedComment.findOne(id);
  }
  public async update(model: FeedComment): Promise<FeedComment> {
    const feedComment = await FeedComment.save(model);
    return FeedComment.findOne(feedComment.id, {
      relations: ['user']
    });
  }
  public async remove(id: number): Promise<void> {
    await FeedComment.softRemove({ id } as FeedComment);
  }
  public async removeByUserReviewId(feedId: number): Promise<void> {
    await FeedComment.softRemove({ feedId } as FeedComment);
  }
}
