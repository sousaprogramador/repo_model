import { Injectable } from '@nestjs/common';
import { Partner } from 'src/modules/database/models/partners.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class PartnersRepository {
  public async listAll(options: FindManyOptions<Partner>): Promise<Partner[]> {
    return Partner.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Partner>
  ): Promise<Pagination<Partner>> {
    return paginate<Partner>(
      getRepository(Partner),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  async findById(id: number): Promise<Partner> {
    return Partner.findOne(id);
  }

  async insert(model: Partner): Promise<Partner> {
    return Partner.save(model);
  }

  async update(model: Partner): Promise<Partner> {
    return Partner.save(model);
  }

  async remove(id: number): Promise<void> {
    await Partner.delete(id);
  }
}
