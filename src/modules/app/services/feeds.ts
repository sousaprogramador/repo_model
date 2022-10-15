import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { IPagination, IPaginated } from 'src/modules/common/services/pagination';
import { FeedImage } from 'src/modules/database/models/feedImages.entity';
import { FeedLike } from 'src/modules/database/models/feedLikes.entity';
import { Feed } from 'src/modules/database/models/feeds.entity';
import { Notifications } from 'src/modules/database/models/notifications.entity';
import { User } from 'src/modules/database/models/users.entity';
import { createQueryBuilder, FindConditions, FindManyOptions, getRepository, In, Not } from 'typeorm';
import { FeedLikesRepository } from '../repositories/feedLikes';
import { FeedRepository } from '../repositories/feeds';
import { NotificationsRepository } from '../repositories/notifications';
import { UsersRepository } from '../repositories/users';
import { FollowsRepository } from '../repositories/follows';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListFeeds } from '../validators/feed/get';
import { ListFeedComments } from '../validators/feed/getComments';
import { CreateFeed, CreateLike } from '../validators/feed/save';
import { FeedCommentService } from './feedComments';
import { FeedImageService } from './feedImages';
import { NotificationsService } from './notifications';
import { OneSignalService } from './oneSignal';
import { AwsService } from 'src/modules/common/services/aws';

@Injectable()
export class FeedService {
  logger: Logger;
  constructor(
    private oneSignalService: OneSignalService,
    private feedRepository: FeedRepository,
    private feedImageService: FeedImageService,
    private feedCommentsService: FeedCommentService,
    private feedLikeRepository: FeedLikesRepository,
    private notificationsService: NotificationsService,
    private notificationRepository: NotificationsRepository,
    private userRepository: UsersRepository,
    private followsRepository: FollowsRepository,
    private awsService: AwsService
  ) {
    this.logger = new Logger('FeedService');
  }

  public async list(params: ListFeeds, userLogged?: Partial<User>): Promise<IPaginated<Feed>> {
    try {
      const { page, limit, search } = params;

      const paginationOption = { page: page || 1, limit: limit || 10 };
      const data = await this.feedRepository.listWithCount(userLogged, paginationOption, search);

      // TODO: Melhorar essa logica
      const resultItems = await Promise.all(
        data.items.map(async feed => {
          feed.user.followData = await this.followsRepository.followNumbers(feed.user.id);

          const followInfo = await this.followsRepository.followInfo(userLogged.id, feed.user.id);
          feed.user.followMe = followInfo.isFollower;
          feed.user.imFollowing = followInfo.imFollowing;

          return feed;
        })
      );
      data.items = resultItems;

      return data;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-list-feed');
    }
  }

  public async getFeedComments(feedId: number, params: PaginationQuery) {
    const feed = await this.feedRepository.findById(feedId);

    if (!feed) throw new NotFoundException('feed-not-found');

    const newParams = { ...params, feedId: feed.id } as ListFeedComments;

    return this.feedCommentsService.list(newParams);
  }

  public async getFeedLikes(feedId: number, params: PaginationQuery) {
    const feed = await this.feedRepository.findById(feedId);
    if (!feed) throw new NotFoundException('feed-not-found');

    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {
      page: page || 1,
      limit: limit || 10
    } as IPaginationOptions;

    const options = {} as FindManyOptions<FeedLike>;
    const where = {} as FindConditions<FeedLike>;

    // os dados de busca
    where.feedId = Number(feedId);
    options.where = where;
    options.relations = ['user'];

    return this.feedLikeRepository.list(paginationOption, options);
  }

  public async getFeed(id: number, userLogged?: Partial<User>): Promise<Feed> {
    try {
      const feed = await this.feedRepository.findById(id);

      if (!feed) throw new NotFoundException('feed-not-found');

      const thisFeed = await getRepository(Feed)
        .createQueryBuilder('feed')
        .setParameter('userId', userLogged.id)
        .leftJoinAndSelect('feed.images', 'images')
        .leftJoinAndSelect('feed.user', 'user')
        .leftJoinAndSelect('feed.likes', 'likes')
        .loadRelationCountAndMap('feed.commentsCount', 'feed.comments')
        .loadRelationCountAndMap('feed.likesCount', 'feed.likes')
        .loadRelationCountAndMap('feed.isLiked', 'feed.likes', 'myLikes', qb =>
          qb.andWhere('myLikes.userId = :userId', { userId: userLogged.id })
        )
        .leftJoinAndSelect('likes.user', 'likesUser')
        // .leftJoinAndSelect('user.interests', 'interests') TODO: Verificar se estava sendo usado
        .where('feed.id = :id', { id: id })
        .getOne();

      return thisFeed;
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-get-feed');

      throw error;
    }
  }

  public async createFeed(model: CreateFeed, user: Partial<User>): Promise<Feed> {
    try {
      let images: string[] | FeedImage[] = model.images || [];
      delete model.images;

      const newFeed = {
        text: model.text,
        userId: user.id
      } as Feed;

      const feedCreated = await this.feedRepository.insert(newFeed);

      if (!feedCreated) throw new BadRequestException('feed-not-created');

      images =
        images.map<FeedImage>(
          image =>
            ({
              filename: image,
              feedId: feedCreated.id
            } as FeedImage)
        ) || [];

      if (Array.isArray(images) && images.length > 0) {
        //
        const result = await this.feedImageService.saveMany(images);
        images = result;
      }

      return {
        ...feedCreated,
        images
      } as Feed;
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }

  public async deleteFeed(id: number, user: Partial<User>): Promise<void> {
    try {
      const feed = await this.feedRepository.findById(id);

      if (!feed) throw new NotFoundException('feed-not-found');

      if (feed.userId !== user.id) throw new BadRequestException('feed-not-owner');

      await this.feedRepository.remove(id);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-delete-feed');

      throw error;
    }
  }

  public async updateFeed(id: number, model: Partial<Feed>, user: Partial<User>): Promise<Feed> {
    try {
      const images: string[] | FeedImage[] = model.images;
      delete model.images;

      const feed = await this.feedRepository.findById(id);

      if (!feed) throw new NotFoundException('feed-not-found');

      if (feed.userId !== user.id) throw new BadRequestException('feed-not-owner');

      const newFeed = {
        ...model,
        id: id
      } as Feed;

      const feedUpdated = await this.feedRepository.update(newFeed);

      if (!feedUpdated) throw new BadRequestException('feed-not-updated');

      if (!!images) {
        // delete images
        const imagesOfFeed = await getRepository(FeedImage)
          .createQueryBuilder('feedImages')
          .select('feedImages.id')
          .where('feedImages.feedId = :feedId', { feedId: feedUpdated.id })
          .getMany();

        const imagesToDelete = imagesOfFeed.filter(image => !images.map(e => e.id).includes(image.id));

        if (imagesToDelete.length > 0) {
          await getRepository(FeedImage)
            .createQueryBuilder('feedImages')
            .softDelete()
            .where('feedImages.id IN (:...ids)', { ids: imagesToDelete.map(image => image.id) })
            .execute();
        }
        // add images
        const imagesWithId = images.map(image => {
          return { ...image, feedId: id };
        });
        const imagesWithoutId = (imagesWithId as Array<string | FeedImage>).filter((img: FeedImage) => {
          if (img?.id) return false;
          return true;
        });

        await this.feedImageService.saveMany(imagesWithoutId as FeedImage[]);
      }

      // const thisFeed = await this.feedRepository.findById(id);

      return this.getFeed(id, user);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-update-feed');

      throw error;
    }
  }

  public async toggleLike(feedId: number, user: Partial<User>): Promise<Feed> {
    const feed = await this.feedRepository.findById(feedId);
    if (!feed) throw new NotFoundException('feed-not-found');

    const userId = user.id;
    const isLiked = feed.likes.some(like => like.userId === userId);

    if (isLiked) {
      await this.removeLike(feedId, userId);
    } else {
      await this.addLike(feedId, userId);
    }

    return this.feedRepository.findById(feedId);
  }

  public async likeOrUnlike(feedId: number, model: CreateLike, user: Partial<User>) {
    const feed = await this.feedRepository.findById(feedId);

    if (!feed) throw new NotFoundException('feed-not-found');

    const { like } = model;

    if (like) {
      await this.addLike(feedId, user.id);
    } else {
      await this.removeLike(feedId, user.id);
    }
  }

  private async addLike(feedId: number, userId: number): Promise<void | FeedLike> {
    this.logger.log(`addLike ${feedId} ${userId}`);
    try {
      const feedLike = await this.feedLikeRepository.findOne({
        where: {
          feedId: feedId,
          userId: userId
        },
        relations: ['feed']
      });

      if (!feedLike) {
        const feed = await this.feedRepository.findOne({
          where: {
            id: feedId
          }
        });

        const likeInsert = await this.feedLikeRepository.insert({
          feedId: feedId,
          userId: userId
        } as FeedLike);

        if (feed.userId !== userId) {
          const userOrigin = await this.userRepository.findOne({ id: userId });

          //TODO: validar notificações se existe antes de criar, setar deleteAt null. status: unread

          // Salvar em notificações
          await this.notificationsService.create({
            userId: feed.userId,
            type: 'like',
            originModelId: likeInsert.id,
            originUserId: userId,
            status: 'unread',
            feedId: feedId
          });

          await this.oneSignalService.sendNotification({
            userId: feed.userId,
            title: 'Nova curtida',
            message: `${userOrigin.name} curtiu seu post`,
            data: {
              feedId: feedId
            }
          });
        }

        return likeInsert;
      }

      return await this.feedLikeRepository.update({
        id: feedLike.id,
        like: true,
        deletedAt: null
      } as FeedLike);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-add-like');

      throw error;
    }
  }

  private async removeLike(feedId: number, userId: number): Promise<void | FeedLike> {
    this.logger.log(`removeLike ${feedId} ${userId}`);
    try {
      const feedLike = await this.feedLikeRepository.findOne({
        where: {
          feedId: feedId,
          userId: userId
        }
      });

      if (!feedLike) throw new BadRequestException('feed-not-liked');

      // Se acaso existir uma notificação desse like, marcar como excluida para não aparecer que curtiu para o usuario

      const notificationOrigin = await this.notificationRepository.findOne({
        where: {
          originModelId: feedLike.id,
          originUserId: userId,
          type: 'like',
          status: Not('deleted')
        }
      });

      if (notificationOrigin) {
        await this.notificationRepository.update({
          ...notificationOrigin,
          status: 'deleted',
          deletedAt: new Date()
        } as Notifications);
      }

      return await this.feedLikeRepository.update({
        id: feedLike.id,
        like: false,
        deletedAt: new Date()
      } as FeedLike);
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-remove-like');

      throw error;
    }
  }

  public async findImagesByUserId(userId: number): Promise<FeedImage[]> {
    try {
      const feeds = await this.feedRepository.listAll({
        where: {
          userId: userId
        }
      });

      if (feeds.length === 0) return [];

      const feedsIds = feeds.map(feed => feed.id);

      const feedImages = await this.feedImageService.listAll({
        where: {
          feedId: In(feedsIds)
        }
      });

      const data = [];
      feedImages.map(image => {
        const feed = feeds.find(feed => feed.id === image.feedId);
        if (feed) {
          data.push({
            ...image,
            feedId: feed.id
          });
        }
      });

      return data;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-find-feed-images');
    }
  }

  public async feedImage(model: CreateFeed, files: Express.Multer.File, user: Partial<User>): Promise<Feed> {
    try {
      let fileUploaded = null;
      if (files) {
        fileUploaded = await this.awsService.uploadS3(files, 'user');

        if (!fileUploaded) throw new BadRequestException('upload-failed');
      }
      let images: string[] | FeedImage[] = model.images || [];
      delete model.images;

      if (fileUploaded) images.push(fileUploaded.url);

      const newFeed = {
        text: model.text,
        userId: user.id
      } as Feed;

      const feedCreated = await this.feedRepository.insert(newFeed);

      if (!feedCreated) throw new BadRequestException('feed-not-created');

      images =
        images.map<FeedImage>(
          image =>
            ({
              filename: image,
              feedId: feedCreated.id
            } as FeedImage)
        ) || [];

      if (Array.isArray(images) && images.length > 0) {
        //
        const result = await this.feedImageService.saveMany(images);
        images = result;
      }

      return {
        ...feedCreated,
        images
      } as Feed;
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-create-feed');

      throw error;
    }
  }
}
