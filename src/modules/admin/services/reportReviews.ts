import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UserReportedReview } from 'src/modules/database/models/usersReportedReviews.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
import { ReportReviewsRepository } from '../repositories/reportReviews';
import { ListUserReportedReviews } from '../validators/reports/get';

@Injectable()
export class ReportReviewsService {
  constructor(private reportsRepository: ReportReviewsRepository) {}

  public async list(params: ListUserReportedReviews) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<UserReportedReview>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    } else {
      options.order = {
        createdAt: 'ASC'
      };
    }

    const where = {} as FindConditions<UserReportedReview>;
    // os dados de busca
    options.where = where;
    options.relations = ['review', 'review.images'];

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.reportsRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.reportsRepository.listAll(options);
  }

  public async save(model: UserReportedReview): Promise<UserReportedReview> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: UserReportedReview): Promise<UserReportedReview> {
    console.log(model);
    try {
      const DestinationsCategory = await this.reportsRepository.insert(model);
      return DestinationsCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(reportsId: number): Promise<UserReportedReview> {
    const report = await this.reportsRepository.findById(reportsId);

    if (!report) throw new NotFoundException('not-found');

    return report;
  }

  private async update(model: UserReportedReview): Promise<UserReportedReview> {
    const report = await this.reportsRepository.findById(model.id);
    if (!report) throw new NotFoundException('not-found');

    return this.reportsRepository.update(model);
  }

  public async remove(reportsId: number): Promise<void> {
    const report = await this.reportsRepository.findById(reportsId);

    if (!report) {
      throw new NotFoundException('not-found');
    }

    return this.reportsRepository.remove(reportsId);
  }
}
