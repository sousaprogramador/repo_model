import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { UsersTripsGalleries } from 'src/modules/database/models/usersTripsGallery.entity';
import { UsersTripsGalleriesRepository } from '../repositories/usersTripsGallery';

@Injectable()
class UsersTripsGalleriesService {
  logger: Logger;
  constructor(private usersTripsGalleriesRepository: UsersTripsGalleriesRepository) {
    this.logger = new Logger('UsersTripsGalleriesRepository');
  }

  public async findById(galeryId: number): Promise<UsersTripsGalleries> {
    const preference = await this.usersTripsGalleriesRepository.findById(galeryId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  public async create(model: UsersTripsGalleries): Promise<UsersTripsGalleries> {
    try {
      return await this.usersTripsGalleriesRepository.insert(model);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const feed = await this.usersTripsGalleriesRepository.findById(id);

      if (!feed) throw new NotFoundException('feed-not-found');

      await this.usersTripsGalleriesRepository.remove(id);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-delete-feed');

      throw error;
    }
  }
}

export { UsersTripsGalleriesService };
