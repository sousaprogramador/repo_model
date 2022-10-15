import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Partner } from 'src/modules/database/models/partners.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PartnersRepository } from '../repositories/partners';
import { PaginationQuery } from '../validators/common/paginationQuery';

@Injectable()
export class PartnersService {
  logger: Logger;
  constructor(private partnersRepository: PartnersRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {
      page: page || 1,
      limit: limit || 10
    } as IPaginationOptions;

    return this.partnersRepository.list(paginationOption);
  }

  public async findById(PartnersId: number): Promise<Partner> {
    const partner = await this.partnersRepository.findById(PartnersId);

    if (!partner) throw new NotFoundException('not-found');

    return partner;
  }
}
