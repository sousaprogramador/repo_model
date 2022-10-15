import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserReviewImagesRepository } from '../repositories/userReviewImages';
import { UserReviewImage } from '../../database/models/usersReviewsImages.entity';
import { UserReviewsRepository } from '../repositories/userReview';

import { User } from 'src/modules/database/models/users.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ListUsersReviewImages } from '../validators/userReview/getImages';
import { FindConditions, FindManyOptions } from 'typeorm';

@Injectable()
export class UserReviewImagesService {
  logger: Logger;
  constructor(
    private usersReviewsImagesRepository: UserReviewImagesRepository,
    private usersReviewRepository: UserReviewsRepository
  ) {
    this.logger = new Logger();
  }
  public async listAll(options?: FindManyOptions<UserReviewImage>) {
    return this.usersReviewsImagesRepository.listAll(options);
  }
  public async list(params: ListUsersReviewImages) {
    try {
      const { page, limit, ...rest } = params;
      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      const options = {} as FindManyOptions<UserReviewImage>;
      const where = {} as FindConditions<UserReviewImage>;

      // os dados de busca
      if (rest.userReviewId) where.usersReviewId = Number(rest.userReviewId);

      options.where = where;

      return this.usersReviewsImagesRepository.list(paginationOption, options);

      // Outras opções de search
    } catch (e) {
      this.logger.error('Error list UserReviewImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async save(model: UserReviewImage): Promise<UserReviewImage> {
    try {
      const destination = await this.usersReviewRepository.findById(model.usersReviewId);

      if (!destination) throw new NotFoundException('destination-not-found');

      if (model.id) return this.update(model);

      return this.create(model);
    } catch (e) {
      this.logger.error('Error save UserReviewImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async saveMany(models: UserReviewImage[]): Promise<UserReviewImage[] | void> {
    try {
      await Promise.all(
        models.map(model => {
          if (model.id) {
            return this.update(model);
          }
          return this.create(model);
        })
      );
    } catch (e) {
      this.logger.error('Error save saveMany:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async create(model: UserReviewImage): Promise<UserReviewImage> {
    try {
      const UserReviewImage = await this.usersReviewsImagesRepository.insert(model);
      return UserReviewImage;
    } catch (e) {
      this.logger.error('Error save create:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async update(model: UserReviewImage): Promise<UserReviewImage> {
    try {
      const UserReviewImage = await this.usersReviewsImagesRepository.findById(model.id);
      if (!UserReviewImage) throw new NotFoundException('not-found');

      return this.usersReviewsImagesRepository.update(model);
    } catch (e) {
      this.logger.error('Error update UserReviewImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async findById(userReviewId: number): Promise<UserReviewImage> {
    try {
      const destinationCategory = await this.usersReviewsImagesRepository.findById(userReviewId);
      if (!destinationCategory) throw new NotFoundException('not-found');

      return destinationCategory;
    } catch (e) {
      this.logger.error('Error findById UserReviewImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async removeByUserReviewId(userReviewId: number): Promise<void> {
    try {
      const destination = await this.usersReviewRepository.findById(userReviewId);

      if (!destination) throw new NotFoundException('destination-not-found');

      await this.usersReviewsImagesRepository.removeByUserReviewId(userReviewId);
    } catch (e) {
      this.logger.error('Error removeByUserReviewId UserReviewImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async remove(userReviewId: number, user: Partial<User>): Promise<void> {
    try {
      const userReviewImage = await this.usersReviewsImagesRepository.findById(userReviewId);

      if (!userReviewImage) {
        throw new NotFoundException('not-found');
      }

      const userReview = await this.usersReviewRepository.findById(userReviewImage.usersReviewId);

      if (!userReview || userReview.userId !== user.id) throw new UnauthorizedException('invalid-review');

      return this.usersReviewsImagesRepository.remove(userReviewId);
    } catch (e) {
      this.logger.error('Error remove UserReviewImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }
}
