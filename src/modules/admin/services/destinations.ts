import { Injectable, NotFoundException } from '@nestjs/common';
import { Destination } from 'src/modules/database/models/destinations.entity';

import { DestinationRepository } from 'src/modules/admin/repositories/destinations';

import { DestinationsCategoriesRepository } from 'src/modules/admin/repositories/destinationsCategories';
import { CitiesRepository } from 'src/modules/admin/repositories/cities';

import { DestinationImagesService } from './destinationsImages';
import { DestinationImage } from 'src/modules/database/models/destinationsImages.entity';
import { CreateDestination } from '../validators/destinations/save';
import { ListDestination } from '../validators/destinations/get';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindConditions, FindManyOptions, Like } from 'typeorm';
@Injectable()
export class DestinationService {
  constructor(
    private destinationRepository: DestinationRepository,
    private destinationsCategoriesRepository: DestinationsCategoriesRepository,
    private citiesRepository: CitiesRepository,
    private destinationImagesService: DestinationImagesService
  ) {}

  public async list(params: ListDestination) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Destination>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    // os dados de busca

    const where = {} as FindConditions<Destination>;

    if (rest.cityId) where.cityId = rest.cityId;
    if (rest.name) where.name = Like(`%${rest.name}%`);

    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.destinationRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.destinationRepository.listAll(options);
  }

  public async save(model: CreateDestination): Promise<Destination> {
    if (model.tags && Array.isArray(model.tags)) model.tags = model.tags.join(',');

    const city = await this.citiesRepository.findById(model.cityId);

    if (!city) throw new NotFoundException('city-invalid');

    if (model.id) return this.update(model);

    return this.create(model);
  }

  private async create(model: CreateDestination): Promise<Destination> {
    if (model.images) {
      model.images = model.images.map<DestinationImage>(image => ({ path: image } as DestinationImage));
    }
    let interestsId: number[] = [];
    if (model.interests) {
      interestsId = model.interests.map<number>(interest => {
        // if (destination?.id) return destination.id;

        return interest;
      });
      delete model.interests;
    }
    let categoriesId: number[] = [];

    if (model.categories) {
      categoriesId = model.categories;
      delete model.categories;
    }

    try {
      const destination = await this.destinationRepository.insert(model);

      if (destination && interestsId.length > 0) {
        await this.destinationRepository.updateInterests(destination.id, interestsId);
      }

      if (destination && categoriesId.length > 0) {
        await this.destinationRepository.updateCategories(destination.id, categoriesId);
      }

      return destination;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(destinationId: number): Promise<Destination> {
    const destination = await this.destinationRepository.findById(destinationId);

    if (!destination) throw new NotFoundException('not-found');

    return destination;
  }

  private async update(model: CreateDestination): Promise<Destination> {
    if (model.images) {
      const carousel = model.images.map<DestinationImage>(
        image => ({ path: image, destinationId: model.id } as DestinationImage)
      );

      if (carousel.length >= 0) {
        await this.destinationImagesService.removeByDestinationId(model.id);
        await this.destinationImagesService.saveMany(carousel);
      }

      delete model.images;
    }

    let interestsId: number[] = [];
    if (model.interests) {
      interestsId = model.interests.map<number>(interest => {
        // if (destination?.id) return destination.id;

        return interest;
      });
      delete model.interests;
    }

    let categoriesId: number[] = [];

    if (model.categories) {
      categoriesId = model.categories.map<number>(category => category);
      delete model.categories;
    }

    const destination = await this.destinationRepository.update(model);

    if (destination && interestsId.length >= 0) {
      await this.destinationRepository.deleteInterestsByDestinationId(destination.id);

      await this.destinationRepository.updateInterests(destination.id, interestsId);
    }

    if (destination && categoriesId.length >= 0) {
      await this.destinationRepository.deleteCategoriesByDestinationId(destination.id);

      await this.destinationRepository.updateCategories(destination.id, categoriesId);
    }

    return destination;
  }

  public async remove(destinationId: number): Promise<void> {
    const destination = await this.destinationRepository.findById(destinationId);

    if (!destination) {
      throw new NotFoundException('not-found');
    }

    return this.destinationRepository.remove(destinationId);
  }
}
