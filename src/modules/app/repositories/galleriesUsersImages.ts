import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { GalleriesUsersImages } from 'src/modules/database/models/galleriesUsersImages.entity';

@Injectable()
export class GalleriesUsersImagesRepository {
  public async listAll(options: FindManyOptions<GalleriesUsersImages>): Promise<GalleriesUsersImages[]> {
    return GalleriesUsersImages.find(options);
  }

  async findById(id: number): Promise<GalleriesUsersImages> {
    return GalleriesUsersImages.findOne(id);
  }

  public async insert(model: GalleriesUsersImages): Promise<GalleriesUsersImages> {
    return await GalleriesUsersImages.save(model);
  }

  public async update(model: GalleriesUsersImages): Promise<GalleriesUsersImages> {
    return await GalleriesUsersImages.save(model);
  }

  public async remove(id: number): Promise<void> {
    await GalleriesUsersImages.softRemove({ id } as GalleriesUsersImages);
  }
}
