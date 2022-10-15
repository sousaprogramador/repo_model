import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { WishlistsGallery } from 'src/modules/database/models/wishlistsGallery.entity';

@Injectable()
export class WishlistsGalleryRepository {
  public async listAll(options: FindManyOptions<WishlistsGallery>): Promise<WishlistsGallery[]> {
    return WishlistsGallery.find(options);
  }

  async findById(id: number): Promise<WishlistsGallery> {
    return WishlistsGallery.findOne(id);
  }

  public async insert(model: WishlistsGallery): Promise<WishlistsGallery> {
    return await WishlistsGallery.save(model);
  }

  public async update(model: WishlistsGallery): Promise<WishlistsGallery> {
    return await WishlistsGallery.save(model);
  }

  public async remove(id: number): Promise<void> {
    await WishlistsGallery.softRemove({ id } as WishlistsGallery);
  }
}
