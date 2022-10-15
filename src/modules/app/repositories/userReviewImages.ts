import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { UserReviewImage } from '../../database/models/usersReviewsImages.entity';

@Injectable()
export class UserReviewImagesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<UserReviewImage>
  ): Promise<Pagination<UserReviewImage>> {
    return paginate<UserReviewImage>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(options?: FindManyOptions<UserReviewImage>): Promise<UserReviewImage[]> {
    return UserReviewImage.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<UserReviewImage>
  ): Promise<Pagination<UserReviewImage>> {
    return paginate<UserReviewImage>(
      getRepository(UserReviewImage),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options
      }
    );
  }
  public async insert(model: UserReviewImage): Promise<UserReviewImage> {
    return UserReviewImage.save(model);
  }

  public async findById(id: number): Promise<UserReviewImage> {
    return UserReviewImage.findOne(id);
  }
  public async update(model: UserReviewImage): Promise<UserReviewImage> {
    return UserReviewImage.save(model);
  }
  public async remove(id: number): Promise<void> {
    await UserReviewImage.softRemove({ id } as UserReviewImage);
  }
  public async removeByUserReviewId(userReviewId: number): Promise<void> {
    await UserReviewImage.softRemove({ usersReviewId: userReviewId } as UserReviewImage);
  }
}
