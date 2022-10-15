import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { Gallery } from 'src/modules/database/models/galleries.entity';

@Injectable()
export class GalleryRepository {
  public async listAll(options: FindManyOptions<Gallery>): Promise<Gallery[]> {
    return Gallery.find(options);
  }

  async findById(id: number): Promise<Gallery> {
    return Gallery.findOne(id);
  }

  public async insert(model: Gallery): Promise<Gallery> {
    return await Gallery.save(model);
  }

  public async update(model: Gallery): Promise<Gallery> {
    return await Gallery.save(model);
  }

  public async remove(id: number): Promise<void> {
    await Gallery.softRemove({ id } as Gallery);
  }
}
