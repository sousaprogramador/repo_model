import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { UsersImages } from 'src/modules/database/models/usersImages.entity';

@Injectable()
export class UsersImagesRepository {
  public async listAll(options: FindManyOptions<UsersImages>): Promise<UsersImages[]> {
    return UsersImages.find(options);
  }

  async findById(id: number): Promise<UsersImages> {
    return UsersImages.findOne(id);
  }

  public async insert(model: UsersImages): Promise<UsersImages> {
    return await UsersImages.save(model);
  }

  public async update(model: UsersImages): Promise<UsersImages> {
    return await UsersImages.save(model);
  }

  public async remove(id: number): Promise<void> {
    await UsersImages.softRemove({ id } as UsersImages);
  }
}
