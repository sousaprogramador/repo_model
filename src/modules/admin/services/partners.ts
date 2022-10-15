import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Partner } from 'src/modules/database/models/partners.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PartnersRepository } from '../repositories/partners';
import { ListPartners } from '../validators/partners/get';

@Injectable()
export class PartnersService {
  constructor(private partnersRepository: PartnersRepository) {}

  public async list(params: ListPartners) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Partner>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Partner>;
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.partnersRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.partnersRepository.listAll(options);
  }

  public async save(model: Partner): Promise<Partner> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: Partner): Promise<Partner> {
    try {
      const partner = await this.partnersRepository.insert(model);
      return partner;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(PartnersId: number): Promise<Partner> {
    const partner = await this.partnersRepository.findById(PartnersId);

    if (!partner) throw new NotFoundException('not-found');

    return partner;
  }

  private async update(model: Partner): Promise<Partner> {
    const partner = await this.partnersRepository.findById(model.id);
    if (!partner) throw new NotFoundException('not-found');

    return this.partnersRepository.update(model);
  }

  public async remove(PartnersId: number): Promise<void> {
    const partner = await this.partnersRepository.findById(PartnersId);

    if (!partner) {
      throw new NotFoundException('not-found');
    }

    return this.partnersRepository.remove(PartnersId);
  }
}
