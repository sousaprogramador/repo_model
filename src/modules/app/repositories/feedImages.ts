import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { FeedImage } from '../../database/models/feedImages.entity';

@Injectable()
export class FeedImagesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<FeedImage>
  ): Promise<Pagination<FeedImage>> {
    return paginate<FeedImage>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(options?: FindManyOptions<FeedImage>): Promise<FeedImage[]> {
    return FeedImage.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<FeedImage>
  ): Promise<Pagination<FeedImage>> {
    return paginate<FeedImage>(
      getRepository(FeedImage),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options
      }
    );
  }
  public async insert(model: FeedImage): Promise<FeedImage> {
    return FeedImage.save(model);
  }

  public async findOne(options: FindManyOptions<FeedImage>): Promise<FeedImage> {
    return FeedImage.findOne(options);
  }

  public async findById(id: number): Promise<FeedImage> {
    return FeedImage.findOne(id);
  }
  public async update(model: FeedImage): Promise<FeedImage> {
    return FeedImage.save(model);
  }
  public async remove(id: number): Promise<void> {
    await FeedImage.softRemove({ id } as FeedImage);
  }
  public async removeFeedId(feedId: number): Promise<void> {
    await FeedImage.softRemove({ feedId } as FeedImage);
  }
}
