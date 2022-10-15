import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';
import { FindManyOptions, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class UserReviewsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<UserReview>
  ): Promise<Pagination<UserReview>> {
    return paginate<UserReview>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });

    // const page = Number(paginationOptions.page) || 1;
    // const limit = Number(paginationOptions.limit) || 10;

    // const items = await selectQueryBuilder
    //   .take(limit)
    //   .skip((page - 1) * limit)
    //   .getMany();

    // return createPaginationObject({
    //   items: items,
    //   // .slice(
    //   //   (Number(paginationOptions.page) - 1) * Number(paginationOptions.limit),
    //   //   Number(paginationOptions.page) * Number(paginationOptions.limit)
    //   // )
    //   currentPage: page,
    //   limit: limit,
    //   totalItems: items.length
    // });
  }

  public async listAll(options: FindManyOptions<UserReview>): Promise<UserReview[]> {
    return UserReview.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<UserReview>
  ): Promise<Pagination<UserReview>> {
    return paginate<UserReview>(
      getRepository(UserReview),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['destination', 'images'],
        ...options
      }
    );
  }

  public async findById(id: number): Promise<UserReview> {
    return UserReview.findOne(id, {
      relations: ['destination', 'images']
    });
  }
  public async findOne(options: FindOneOptions<UserReview>) {
    return UserReview.findOne(options);
  }

  public async insert(model: UserReview): Promise<UserReview> {
    return UserReview.save(model);
  }

  public async update(model: UserReview): Promise<UserReview> {
    return UserReview.save(model);
  }

  public async remove(id: number): Promise<void> {
    await UserReview.softRemove({ id } as UserReview);
  }
}
