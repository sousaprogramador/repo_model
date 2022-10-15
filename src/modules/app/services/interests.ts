import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Interest } from 'src/modules/database/models/interests.entity';
import { PaginationQuery } from '../validators/common/paginationQuery';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InterestsRepository } from './../repositories/interests';

@Injectable()
export class InterestsService {
  logger: Logger;
  constructor(private interestsRepository: InterestsRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.interestsRepository.list(paginationOption);
    }
    // Outras opções de search
    return this.interestsRepository.listAll();
  }

  public async findById(interestsId: number): Promise<Interest> {
    const interest = await this.interestsRepository.findById(interestsId);

    if (!interest) throw new NotFoundException('not-found');

    return interest;
  }
}
