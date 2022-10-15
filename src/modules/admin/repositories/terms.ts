import { Injectable } from '@nestjs/common';
import { Term } from 'src/modules/database/models/terms.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class TermsRepository {
  public async listAll(options: FindManyOptions<Term>): Promise<Term[]> {
    return Term.find(options);
  }
  public async list(paginationOptions: IPaginationOptions, options: FindManyOptions<Term>): Promise<Pagination<Term>> {
    return paginate<Term>(
      getRepository(Term),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  async findById(id: number): Promise<Term> {
    return Term.findOne(id);
  }

  async insert(model: Term): Promise<Term> {
    return Term.save(model);
  }

  async update(model: Term): Promise<Term> {
    return Term.save(model);
  }

  async remove(id: number): Promise<void> {
    await Term.delete(id);
  }
}
