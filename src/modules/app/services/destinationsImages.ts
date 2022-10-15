import { Injectable, Logger, NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DestinationsImagesRepository } from '../repositories/destinationsImages';
import { DestinationImage } from '../../database/models/destinationsImages.entity';
import { DestinationRepository } from '../repositories/destinations';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class DestinationImagesService {
  logger: Logger;
  constructor(
    private destinationImagesRepository: DestinationsImagesRepository,
    private destinationRepository: DestinationRepository
  ) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = { page: page || 1, limit: limit || 10 } as IPaginationOptions;

    paginationOption.page = page;
    paginationOption.limit = limit;
    return this.destinationImagesRepository.list(paginationOption);

    // Outras opções de search
    // return this.destinationImagesRepository.listAll();
  }

  public async findById(destinationImagesId: number): Promise<DestinationImage> {
    const destinationCategory = await this.destinationImagesRepository.findById(destinationImagesId);
    if (!destinationCategory) throw new NotFoundException('not-found');

    return destinationCategory;
  }
}
