import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { User } from 'src/modules/database/models/users.entity';
import { UsersImages } from 'src/modules/database/models/usersImages.entity';
import { UsersImagesRepository } from '../repositories/usersImages';
import { CreateUsersImages } from '../validators/usersImages/save';
import { AwsService } from 'src/modules/common/services/aws';
import { GalleriesUsersImages } from 'src/modules/database/models/galleriesUsersImages.entity';
import { GalleriesUsersImagesService } from './galleriesUsersImages';

@Injectable()
class UsersImagesService {
  logger: Logger;
  constructor(
    private usersImagesRepository: UsersImagesRepository,
    private awsService: AwsService,
    private galleriesUsersImagesService: GalleriesUsersImagesService
  ) {
    this.logger = new Logger('UsersImagesService');
  }

  public async list(userLogged?: Partial<User>): Promise<UsersImages[]> {
    try {
      return await this.usersImagesRepository.listAll({
        where: {
          userId: userLogged.id
        }
      });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-list-feed');
    }
  }

  public async findById(galeryId: number): Promise<UsersImages> {
    const preference = await this.usersImagesRepository.findById(galeryId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  public async create(file: Express.Multer.File, model: CreateUsersImages, user: Partial<User>): Promise<UsersImages> {
    try {
      const dir = 'users';
      const fileUploaded = await this.awsService.uploadS3(file, dir);

      if (!fileUploaded) throw new BadRequestException('upload-failed');

      const userImage = {
        filename: fileUploaded.url,
        userId: user.id
      } as UsersImages;

      const newUserImages = await this.usersImagesRepository.insert(userImage);

      if (!userImage) throw new BadRequestException('user-images-failed');

      const galleriesUsersImages = {
        galleryId: +model.galleryId,
        imageId: userImage.id
      } as GalleriesUsersImages;

      await this.galleriesUsersImagesService.create(galleriesUsersImages);

      return newUserImages;
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      const feed = await this.usersImagesRepository.findById(id);

      if (!feed) throw new NotFoundException('user-not-found');

      await this.usersImagesRepository.remove(id);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-delete-feed');

      throw error;
    }
  }
}

export { UsersImagesService };
