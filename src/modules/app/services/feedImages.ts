import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/database/models/users.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
import { FeedImage } from '../../database/models/feedImages.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FeedImagesRepository } from '../repositories/feedImages';
import { FeedRepository } from '../repositories/feeds';
import { ListUsersReviewImages } from '../validators/userReview/getImages';

@Injectable()
export class FeedImageService {
  logger: Logger;
  constructor(private feedImagesRepository: FeedImagesRepository, private feedRepository: FeedRepository) {
    this.logger = new Logger('FeedImageService');
  }
  public async listAll(options?: FindManyOptions<FeedImage>) {
    return this.feedImagesRepository.listAll(options);
  }
  public async list(params: ListUsersReviewImages) {
    try {
      const { page, limit, ...rest } = params;
      const paginationOption: IPaginationOptions = {} as IPaginationOptions;

      const options = {} as FindManyOptions<FeedImage>;
      const where = {} as FindConditions<FeedImage>;

      // os dados de busca
      if (rest.userReviewId) where.feedId = Number(rest.userReviewId);

      options.where = where;

      if (page && limit) {
        paginationOption.page = page;
        paginationOption.limit = limit;
        return this.feedImagesRepository.list(paginationOption, options);
      }
      // Outras opções de search
      return this.feedImagesRepository.listAll();
    } catch (e) {
      this.logger.error('Error list FeedImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async save(model: FeedImage): Promise<FeedImage> {
    try {
      const destination = await this.feedRepository.findById(model.feedId);

      if (!destination) throw new NotFoundException('destination-not-found');

      if (model.id) return this.update(model);

      return this.create(model);
    } catch (e) {
      this.logger.error('Error save FeedImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async saveMany(models: FeedImage[] | string[]): Promise<FeedImage[]> {
    try {
      return await Promise.all(
        models.map(model => {
          if (typeof model.filename === 'string') {
            if (model.id) {
              return this.update(model);
            }
            return this.create(model);
          }
        })
      );
    } catch (e) {
      this.logger.error('Error save saveMany:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async create(model: FeedImage): Promise<FeedImage> {
    try {
      const FeedImage = await this.feedImagesRepository.insert(model);
      return FeedImage;
    } catch (e) {
      this.logger.error('Error save create:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async update(model: FeedImage): Promise<FeedImage> {
    try {
      const FeedImage = await this.feedImagesRepository.findById(model.id);
      if (!FeedImage) throw new NotFoundException('not-found');

      return this.feedImagesRepository.update(model);
    } catch (e) {
      this.logger.error('Error update FeedImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async findById(userReviewId: number): Promise<FeedImage> {
    try {
      const destinationCategory = await this.feedImagesRepository.findById(userReviewId);
      if (!destinationCategory) throw new NotFoundException('not-found');

      return destinationCategory;
    } catch (e) {
      this.logger.error('Error findById FeedImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async removeByFeedId(userReviewId: number): Promise<void> {
    try {
      const feed = await this.feedRepository.findById(userReviewId);

      if (!feed) throw new NotFoundException('feed-not-found');

      await this.feedImagesRepository.removeFeedId(userReviewId);
    } catch (e) {
      this.logger.error('Error removeByUserReviewId FeedImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async remove(userReviewId: number, user: Partial<User>): Promise<void> {
    try {
      const userReviewImage = await this.feedImagesRepository.findById(userReviewId);

      if (!userReviewImage) {
        throw new NotFoundException('not-found');
      }

      const userReview = await this.feedRepository.findById(userReviewImage.feedId);

      if (!userReview || userReview.userId !== user.id) throw new UnauthorizedException('invalid-review');

      return this.feedImagesRepository.remove(userReviewId);
    } catch (e) {
      this.logger.error('Error remove FeedImagesService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }
}
