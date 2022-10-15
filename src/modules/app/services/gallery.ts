import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { User } from 'src/modules/database/models/users.entity';
import { Gallery } from 'src/modules/database/models/galleries.entity';
import { GalleryRepository } from '../repositories/gallery';
import { CreateGallery } from '../validators/gallery/save';
import { GalleriesUsersImagesRepository } from '../repositories/galleriesUsersImages';

@Injectable()
class GalleryService {
  logger: Logger;
  constructor(
    private galleryRepository: GalleryRepository,
    private usersImagesRepository: GalleriesUsersImagesRepository
  ) {
    this.logger = new Logger('GalleryService');
  }

  public async list(userLogged?: Partial<User>): Promise<Gallery[]> {
    try {
      return await this.galleryRepository.listAll({
        where: {
          userId: userLogged.id
        },
        relations: [
          'galeriesUsers',
          'galeriesUsers.galeriesUsersImages',
          'wishlistsGallery',
          'wishlistsGallery.wishlist',
          'wishlistsGallery.wishlist.destination',
          'usersTripsGalleries',
          'usersTripsGalleries.usersTrips'
        ]
      });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-list-feed');
    }
  }

  public async findById(galeryId: number): Promise<Gallery> {
    const preference = await this.galleryRepository.findById(galeryId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  public async create(model: CreateGallery, user: Partial<User>): Promise<Gallery> {
    try {
      const gallery = {
        ...model,
        userId: user.id
      } as Gallery;

      return await this.galleryRepository.insert(gallery);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async update(id: number, model: CreateGallery): Promise<Gallery> {
    try {
      const gallery = this.galleryRepository.findById(id);
      if (!gallery) throw new NotFoundException('not-found');

      const newGallery = {
        ...model,
        id: id
      } as Gallery;

      return await this.galleryRepository.update(newGallery);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const feed = await this.galleryRepository.findById(id);

      if (!feed) throw new NotFoundException('feed-not-found');

      await this.galleryRepository.remove(id);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-delete-feed');

      throw error;
    }
  }
}

export { GalleryService };
