import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { GalleriesUsersImages } from 'src/modules/database/models/galleriesUsersImages.entity';
import { GalleriesUsersImagesRepository } from '../repositories/galleriesUsersImages';

@Injectable()
class GalleriesUsersImagesService {
  logger: Logger;
  constructor(private galleryUsersImagesRepository: GalleriesUsersImagesRepository) {
    this.logger = new Logger('GalleriesUsersImagesService');
  }

  public async findById(galeryId: number): Promise<GalleriesUsersImages> {
    const preference = await this.galleryUsersImagesRepository.findById(galeryId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  public async create(model: GalleriesUsersImages): Promise<GalleriesUsersImages> {
    try {
      return await this.galleryUsersImagesRepository.insert(model);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const feed = await this.galleryUsersImagesRepository.findById(id);

      if (!feed) throw new NotFoundException('feed-not-found');

      await this.galleryUsersImagesRepository.remove(id);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-delete-feed');

      throw error;
    }
  }
}

export { GalleriesUsersImagesService };
