import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { UsersTripsGalleries } from 'src/modules/database/models/usersTripsGallery.entity';

@Injectable()
export class UsersTripsGalleriesRepository {
  public async listAll(options: FindManyOptions<UsersTripsGalleries>): Promise<UsersTripsGalleries[]> {
    return UsersTripsGalleries.find(options);
  }

  async findById(id: number): Promise<UsersTripsGalleries> {
    return UsersTripsGalleries.findOne(id);
  }

  public async insert(model: UsersTripsGalleries): Promise<UsersTripsGalleries> {
    return await UsersTripsGalleries.save(model);
  }

  public async update(model: UsersTripsGalleries): Promise<UsersTripsGalleries> {
    return await UsersTripsGalleries.save(model);
  }

  public async remove(id: number): Promise<void> {
    await UsersTripsGalleries.softRemove({ id } as UsersTripsGalleries);
  }
}
