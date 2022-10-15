import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Term } from 'src/modules/database/models/terms.entity';
import { ListTerms } from '../validators/terms/get';
import { TermsRepository } from '../repositories/terms';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class TermsService {
  logger: Logger;
  constructor(private termsRepository: TermsRepository) {
    this.logger = new Logger();
  }

  public async list(params: ListTerms) {
    const { page, limit, ...rest } = params;
    const paginationOption = {
      page: page || 1,
      limit: limit || 10
    };

    const options = {} as FindManyOptions<Term>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.termsRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.termsRepository.listAll();
  }

  public async findById(termsId: number): Promise<Term> {
    const term = await this.termsRepository.findById(termsId);

    if (!term) throw new NotFoundException('not-found');

    return term;
  }
}
