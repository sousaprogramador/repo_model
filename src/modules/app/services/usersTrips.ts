import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { User } from 'src/modules/database/models/users.entity';
import { UsersTrips } from 'src/modules/database/models/usersTrips.entity';
import { UsersTripsRepository } from '../repositories/usersTrips';
import { CreateUsersImages } from '../validators/usersImages/save';
import { AwsService } from 'src/modules/common/services/aws';
import { UsersTripsGalleries } from 'src/modules/database/models/usersTripsGallery.entity';
import { UsersTripsGalleriesService } from './usersTripsGallery';

@Injectable()
class UsersTripsService {
  logger: Logger;
  constructor(
    private usersTripsRepository: UsersTripsRepository,
    private awsService: AwsService,
    private usersTripsGalleriesService: UsersTripsGalleriesService
  ) {
    this.logger = new Logger('UsersTripsService');
  }

  public async list(userLogged?: Partial<User>): Promise<UsersTrips[]> {
    try {
      return await this.usersTripsRepository.listAll({
        where: {
          userId: userLogged.id
        }
      });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-list-feed');
    }
  }

  public async findById(galeryId: number): Promise<UsersTrips> {
    const preference = await this.usersTripsRepository.findById(galeryId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  public async create(file: Express.Multer.File, model: CreateUsersImages, user: Partial<User>): Promise<UsersTrips> {
    try {
      const dir = 'users';
      const fileUploaded = await this.awsService.uploadS3(file, dir);

      if (!fileUploaded) throw new BadRequestException('upload-failed');

      const userImage = {
        filename: fileUploaded.url,
        userId: user.id
      } as UsersTrips;

      const newUserImages = await this.usersTripsRepository.insert(userImage);

      if (!userImage) throw new BadRequestException('user-images-failed');

      const galleriesUsersImages = {
        galleryId: +model.galleryId,
        imageId: userImage.id
      } as UsersTripsGalleries;

      await this.usersTripsGalleriesService.create(galleriesUsersImages);

      return newUserImages;
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const feed = await this.usersTripsRepository.findById(id);

      if (!feed) throw new NotFoundException('user-not-found');

      await this.usersTripsRepository.remove(id);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-delete-feed');

      throw error;
    }
  }
}

export { UsersTripsService };
