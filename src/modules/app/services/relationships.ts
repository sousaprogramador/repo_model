import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Relationship } from 'src/modules/database/models/relationships.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RelationshipsRepository } from '../repositories/relationships';
import { PaginationQuery } from '../validators/common/paginationQuery';

@Injectable()
export class RelationshipsService {
  logger: Logger;
  constructor(private relationshipsRepository: RelationshipsRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.relationshipsRepository.list(paginationOption);
    }
    // Outras opções de search
    return this.relationshipsRepository.listAll();
  }

  public async findById(relationshipsId: number): Promise<Relationship> {
    const preference = await this.relationshipsRepository.findById(relationshipsId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }
}
