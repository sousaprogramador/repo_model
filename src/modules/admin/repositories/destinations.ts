import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { DestinationsHasCategories } from 'src/modules/database/models/destinationsHasCategories.entity';
import { DestinationHasInterests } from 'src/modules/database/models/destinationsHasInterests.entity';
import { FindManyOptions, getRepository } from 'typeorm';

@Injectable()
export class DestinationRepository {
  public async listAll(options: FindManyOptions<Destination>): Promise<Destination[]> {
    return Destination.find({
      relations: ['offers', 'interests'],
      ...options
    });
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Destination>
  ): Promise<Pagination<Destination>> {
    return paginate<Destination>(
      getRepository(Destination),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['city', 'images', 'interests', 'categories'],
        ...options
      }
    );
  }

  public async insert(model: Destination): Promise<Destination> {
    return Destination.save(model);
  }

  public async findById(id: number): Promise<Destination> {
    return Destination.findOne(id, {
      relations: ['city', 'city.state', 'images', 'offers', 'interests', 'categories']
    });
  }

  public async update(model: Destination): Promise<Destination> {
    return Destination.save(model);
  }

  public async remove(id: number): Promise<void> {
    await Destination.delete(id);
  }

  public async deleteInterestsByDestinationId(destinationId: number): Promise<void> {
    await DestinationHasInterests.delete({ destinationId });
  }

  public async updateInterests(destinationId: number, interestsId: number[]): Promise<void> {
    interestsId.map(async interestId => {
      await DestinationHasInterests.insert({
        destinationId,
        interestId
      });
    });
  }

  public async deleteCategoriesByDestinationId(destinationId: number): Promise<void> {
    await DestinationsHasCategories.delete({ destinationId });
  }

  public async updateCategories(destinationId: number, categoriesId: number[]): Promise<void> {
    Promise.all(
      categoriesId.map(async categoryId => {
        await DestinationsHasCategories.insert({
          destinationId,
          categoryId
        });
      })
    );
  }
}
