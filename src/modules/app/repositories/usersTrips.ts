import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { UsersTrips } from 'src/modules/database/models/usersTrips.entity';

@Injectable()
export class UsersTripsRepository {
  public async listAll(options: FindManyOptions<UsersTrips>): Promise<UsersTrips[]> {
    return await UsersTrips.find(options);
  }

  async findById(id: number): Promise<UsersTrips> {
    return await UsersTrips.findOne(id);
  }

  public async insert(model: UsersTrips): Promise<UsersTrips> {
    return await UsersTrips.save(model);
  }

  public async update(model: UsersTrips): Promise<UsersTrips> {
    return await UsersTrips.save(model);
  }

  public async remove(id: number): Promise<void> {
    await await UsersTrips.softRemove({ id } as UsersTrips);
  }
}
