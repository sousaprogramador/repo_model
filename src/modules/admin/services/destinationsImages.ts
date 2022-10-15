import { Injectable, NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DestinationsImagesRepository } from '../repositories/destinationsImages';
import { DestinationImage } from '../../database/models/destinationsImages.entity';
import { DestinationRepository } from '../repositories/destinations';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class DestinationImagesService {
  constructor(
    private destinationImagesRepository: DestinationsImagesRepository,
    private destinationRepository: DestinationRepository
  ) {}

  public async list(params: PaginationQuery) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.destinationImagesRepository.list(paginationOption);
    }
    // Outras opções de search
    return this.destinationImagesRepository.listAll();
  }

  public async save(model: DestinationImage): Promise<DestinationImage> {
    const destination = await this.destinationRepository.findById(model.destinationId);

    if (!destination) throw new NotFoundException('destination-not-found');

    if (model.id) return this.update(model);

    return this.create(model);
  }

  public async saveMany(models: DestinationImage[]): Promise<DestinationImage[] | void> {
    try {
      await Promise.all(
        models.map(model => {
          if (model.id) {
            return this.update(model);
          }
          return this.create(model);
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async create(model: DestinationImage): Promise<DestinationImage> {
    try {
      const DestinationImage = await this.destinationImagesRepository.insert(model);
      return DestinationImage;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async update(model: DestinationImage): Promise<DestinationImage> {
    const DestinationImage = await this.destinationImagesRepository.findById(model.id);
    if (!DestinationImage) throw new NotFoundException('not-found');

    return this.destinationImagesRepository.update(model);
  }

  public async findById(destinationImagesId: number): Promise<DestinationImage> {
    const destinationCategory = await this.destinationImagesRepository.findById(destinationImagesId);
    if (!destinationCategory) throw new NotFoundException('not-found');

    return destinationCategory;
  }

  public async removeByDestinationId(destinationId: number): Promise<void> {
    const destination = await this.destinationRepository.findById(destinationId);

    if (!destination) throw new NotFoundException('destination-not-found');

    await this.destinationImagesRepository.removeByDestinationId(destinationId);
  }

  public async remove(destinationImagesId: number): Promise<void> {
    const lead = await this.destinationImagesRepository.findById(destinationImagesId);

    if (!lead) {
      throw new NotFoundException('not-found');
    }

    return this.destinationImagesRepository.remove(destinationImagesId);
  }
}
