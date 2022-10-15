import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { UserReportedReview } from 'src/modules/database/models/usersReportedReviews.entity';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class ReportReviewsRepository {
  public async listAll(options: FindManyOptions<UserReportedReview>): Promise<UserReportedReview[]> {
    return UserReportedReview.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<UserReportedReview>
  ): Promise<Pagination<UserReportedReview>> {
    return paginate<UserReportedReview>(
      getRepository(UserReportedReview),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  async findById(id: number): Promise<UserReportedReview> {
    return UserReportedReview.findOne(id);
  }

  async insert(model: UserReportedReview): Promise<UserReportedReview> {
    return UserReportedReview.save(model);
  }

  async update(model: UserReportedReview): Promise<UserReportedReview> {
    return UserReportedReview.save(model);
  }

  async remove(id: number): Promise<void> {
    await UserReportedReview.delete(id);
  }
}
