import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/database/models/users.entity';
import { FindConditions, FindManyOptions, getRepository } from 'typeorm';
import { FeedComment } from '../../database/models/feedComments.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FeedCommentsRepository } from '../repositories/feedComments';
import { FeedRepository } from '../repositories/feeds';
import { ListFeedComments } from '../validators/feed/getComments';
import { CreateComment } from '../validators/feed/saveComment';
import { OneSignalService } from './oneSignal';
import { NotificationsService } from './notifications';
import { UsersRepository } from '../repositories/users';

@Injectable()
export class FeedCommentService {
  logger: Logger;
  constructor(
    private feedCommentRepository: FeedCommentsRepository,
    private feedRepository: FeedRepository,
    private oneSignalService: OneSignalService,
    private notificationsService: NotificationsService,
    private userRepository: UsersRepository
  ) {
    this.logger = new Logger('FeedCommentService');
  }

  public async list(params: ListFeedComments) {
    try {
      const { page, limit, feedId } = params;

      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      const options = {} as FindManyOptions<FeedComment>;

      const where = {} as FindConditions<FeedComment>;

      // os dados de busca
      where.feedId = Number(feedId);

      options.where = where;

      return this.feedCommentRepository.list(paginationOption, options);
    } catch (e) {
      this.logger.error('Error list:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async createComment(model: CreateComment, user: Partial<User>) {
    try {
      const newFeedComment = {
        ...model,
        userId: user.id
      } as FeedComment;
      const savedComment = await this.save(newFeedComment);
      const { userId: userIdFeed } = await this.feedRepository.findById(model.feedId);
      const allComments = await getRepository(FeedComment)
        .createQueryBuilder('feedComment')
        .orderBy('feedComment.createdAt', 'DESC')
        .leftJoinAndSelect('feedComment.user', 'user')
        .where('feedComment.feedId = :feedId', { feedId: savedComment.feedId })
        .limit(3)
        .getMany();

      const newSavedComment = {
        created: savedComment,
        feedCommentsList: allComments
      };

      if (userIdFeed !== user.id) {
        // Salvar em notificações
        await this.notificationsService.create({
          userId: userIdFeed,
          type: 'comment',
          originModelId: savedComment.id,
          originUserId: savedComment.userId,
          status: 'unread',
          feedId: model.feedId
        });
      }

      return newSavedComment;
    } catch (e) {
      this.logger.error('Error createFeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async save(model: FeedComment): Promise<FeedComment> {
    try {
      const feed = await this.feedRepository.findById(model.feedId);

      if (!feed) throw new NotFoundException('feed-not-found');

      if (model.id) return this.update(model);

      return this.create(model, feed.userId);
    } catch (e) {
      this.logger.error('Error save FeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async create(model: FeedComment, userOwnerOfPostId?: number): Promise<FeedComment> {
    try {
      const comment = await this.feedCommentRepository.insert(model);

      if (userOwnerOfPostId && userOwnerOfPostId !== model.userId) {
        const userOrigin = await this.userRepository.findOne({ id: model.userId });
        await this.oneSignalService.sendNotification({
          userId: userOwnerOfPostId,
          title: 'Novo comentário',
          message: `${userOrigin.name} comentou seu post`,
          data: {
            feedId: model.feedId
          }
        });
      }

      return comment;
    } catch (e) {
      this.logger.error('Error save create:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  private async update(model: FeedComment): Promise<FeedComment> {
    try {
      const FeedComment = await this.feedCommentRepository.findById(model.id);
      if (!FeedComment) throw new NotFoundException('not-found');

      return this.feedCommentRepository.update(model);
    } catch (e) {
      this.logger.error('Error update FeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async findById(userReviewId: number): Promise<FeedComment> {
    try {
      const destinationCategory = await this.feedCommentRepository.findById(userReviewId);
      if (!destinationCategory) throw new NotFoundException('not-found');

      return destinationCategory;
    } catch (e) {
      this.logger.error('Error findById FeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async removeByUserReviewId(userReviewId: number): Promise<void> {
    try {
      const destination = await this.feedRepository.findById(userReviewId);

      if (!destination) throw new NotFoundException('destination-not-found');

      await this.feedCommentRepository.removeByUserReviewId(userReviewId);
    } catch (e) {
      this.logger.error('Error removeByUserReviewId FeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async deleteComment(userReviewId: number, user: Partial<User>) {
    try {
      const feedComment = await this.feedCommentRepository.findById(userReviewId);

      if (!feedComment) {
        throw new NotFoundException('not-found');
      }

      if (feedComment.userId !== user.id) throw new UnauthorizedException('feed-comment-not-owner');
      await this.feedCommentRepository.remove(userReviewId);
      const allComments = await getRepository(FeedComment)
        .createQueryBuilder('feedComment')
        .orderBy('feedComment.createdAt', 'DESC')
        .leftJoinAndSelect('feedComment.user', 'user')
        .where('feedComment.feedId = :feedId', { feedId: feedComment.feedId })
        .limit(3)
        .getMany();

      const newDeletedComment = {
        feedCommentsList: allComments
      };

      return newDeletedComment;
    } catch (e) {
      this.logger.error('Error delete FeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }

  public async updateComment(
    feedCommentId: number,
    model: Partial<FeedComment>,
    user: Partial<User>
  ): Promise<FeedComment> {
    try {
      const feedComment = await this.feedCommentRepository.findById(feedCommentId);

      if (!feedComment) {
        throw new NotFoundException('not-found');
      }

      if (feedComment.userId !== user.id) throw new UnauthorizedException('feed-comment-not-owner');

      const newComment = {
        ...model,
        id: feedCommentId
      } as FeedComment;

      return this.feedCommentRepository.update(newComment);
    } catch (e) {
      this.logger.error('Error update FeedCommentService:', e);
      if (!e.message) throw new InternalServerErrorException('Internal Server Error');
      throw e;
    }
  }
}
