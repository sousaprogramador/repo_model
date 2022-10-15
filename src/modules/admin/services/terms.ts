import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Term } from 'src/modules/database/models/terms.entity';
import { FindConditions, FindManyOptions } from 'typeorm';

import { TermsRepository } from '../repositories/terms';
import { ListTerms } from '../validators/terms/get';

@Injectable()
export class TermsService {
  constructor(private termsRepository: TermsRepository) {}

  public async list(params: ListTerms) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<Term>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Term>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.termsRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.termsRepository.listAll(options);
  }

  public async save(model: Term): Promise<Term> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: Term): Promise<Term> {
    console.log(model);
    try {
      const DestinationsCategory = await this.termsRepository.insert(model);
      return DestinationsCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(termsId: number): Promise<Term> {
    const term = await this.termsRepository.findById(termsId);

    if (!term) throw new NotFoundException('not-found');

    return term;
  }

  private async update(model: Term): Promise<Term> {
    const term = await this.termsRepository.findById(model.id);
    if (!term) throw new NotFoundException('not-found');

    return this.termsRepository.update(model);
  }

  public async remove(termsId: number): Promise<void> {
    const term = await this.termsRepository.findById(termsId);

    if (!term) {
      throw new NotFoundException('not-found');
    }

    return this.termsRepository.remove(termsId);
  }
}
