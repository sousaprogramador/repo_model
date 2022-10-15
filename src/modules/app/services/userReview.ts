import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/database/models/users.entity';
import { UserReportedReview } from 'src/modules/database/models/usersReportedReviews.entity';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';
import { UserReviewImage } from 'src/modules/database/models/usersReviewsImages.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { getRepository, In } from 'typeorm';
import { DestinationRepository } from '../repositories/destinations';
import { UserReportedReviewRepository } from '../repositories/userReportedReview';
import { UserReviewsRepository } from '../repositories/userReview';
import { UsersRepository } from '../repositories/users';
import { ListUsersReview } from '../validators/userReview/get';
import { UpdateUserReview } from '../validators/userReview/put';
import { CreateReportReview } from '../validators/userReview/report';
import { CreateUserReview } from '../validators/userReview/save';
import { UserReviewImagesService } from './userReviewImages';

@Injectable()
export class UserReviewService {
  logger: Logger;
  constructor(
    private usersRepository: UsersRepository,
    private userReviewsRepository: UserReviewsRepository,
    private destinationRepository: DestinationRepository,
    private userReviewImagesService: UserReviewImagesService,
    private userReportedReviewRepository: UserReportedReviewRepository,
    private mailService: MailService
  ) {
    this.logger = new Logger();
  }

  public async list(params: ListUsersReview, userId?: number) {
    try {
      const { page, limit } = params;

      const paginationOption = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      const queryBuilder = getRepository(UserReview)
        .createQueryBuilder('reviews')
        .distinct(true)
        .leftJoinAndMapMany('reviews.images', 'usersReviewsImages', 'images', 'images.usersReviewId = reviews.id')
        .leftJoin('reviews.user', 'user')
        .addSelect([
          'user.id',
          // 'user.email',
          'user.name',
          'user.description',
          'user.birthDate',
          'user.friendlyName',
          'user.profilePhoto',
          'user.city',
          'user.state',
          'user.gender',
          'user.sendNotifications'
        ])
        .leftJoinAndSelect('reviews.destination', 'destination')
        .where('reviews.status = true');

      if (userId) {
        queryBuilder.andWhere('reviews.userId = :userId', { userId });
      }

      // if (Number(rest.destinationId)) {
      //   queryBuilder.andWhere('destination.id = :destinationId', { destinationId: rest.destinationId });
      // }

      return this.userReviewsRepository.paginate(paginationOption, queryBuilder);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-list-reviews');
    }
  }

  public async findById(reviewId: number): Promise<UserReview> {
    const review = await this.userReviewsRepository.findById(reviewId);

    if (!review) throw new NotFoundException('not-found');

    return review;
  }

  public async addReview(
    model: CreateUserReview,
    user: Partial<User>
    // images: Express.Multer.File[]
  ): Promise<UserReview> {
    try {
      const { id } = user;

      // Fazer Upload de imagens antes o agora?
      // Array.isArray(images) ?  uploadMany(images) : [];
      let reviewImages: UserReviewImage[] | string[] = model.images;

      delete model.images;

      const destination = await this.destinationRepository.findById(model.destinationId);

      if (!destination) throw new NotFoundException('destination-not-found');

      const newUserReview = {
        ...model,
        userId: id
      } as UserReview;

      const createdReview = await this.userReviewsRepository.insert(newUserReview);

      if (!createdReview) throw new BadRequestException('review-not-created');

      reviewImages =
        reviewImages.map<UserReviewImage>(
          image =>
            ({
              filename: image,
              usersReviewId: createdReview.id
            } as UserReviewImage)
        ) || [];

      if (Array.isArray(reviewImages) && reviewImages.length > 0) {
        //
        await this.userReviewImagesService.saveMany(reviewImages);
      }

      return createdReview;
    } catch (e) {
      this.logger.error(e);
      if (!e.message) throw new BadRequestException('error-create-review');
      throw e;
    }
  }

  public async addReportReview(reviewId: number, model: CreateReportReview, user: Partial<User>) {
    try {
      // Pegando o usuário para usar o nome do mesmo no email
      const { id } = user;
      const userLogged = await this.usersRepository.findById(id);
      if (!userLogged) throw new NotFoundException('user-not-found');

      // Pegando o review para usar o comentário no email
      const review = await this.userReviewsRepository.findById(reviewId);
      if (!review) throw new NotFoundException('review-not-found');

      // Criando o objeto do tipo UserReportReview
      const newUserReportedReview = {
        ...model,
        userId: id,
        usersReviewId: reviewId
      } as UserReportedReview;

      // Salvando o report no banco
      const reviewAdded = await this.userReportedReviewRepository.insert(newUserReportedReview);

      // Enviando email para o pessoal do pinguim
      const emailData = {
        nameUser: userLogged.name,
        reason: model.reason,
        message: model.message,
        review: review.evaluation
      };
      await this.mailService.sendEmailReportedReview(emailData);

      return reviewAdded;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-create-report');
    }
  }

  public async updateReview(reviewId: number, model: UpdateUserReview, user: Partial<User>): Promise<UserReview> {
    try {
      const { id } = user;

      // Fazer Upload de imagens antes o agora?

      const reviewImages =
        Array.isArray(model.images) &&
        model.images.map<UserReviewImage>(
          image =>
            ({
              filename: image,
              usersReviewId: reviewId
            } as UserReviewImage)
        );

      delete model.images;

      const review = await this.userReviewsRepository.findOne({
        where: {
          id: reviewId
        }
      });

      if (!review) throw new NotFoundException('review-not-found');

      if (review.userId !== id) throw new UnauthorizedException('invalid-review');

      const newUserReview = {
        ...review,
        ...model,
        userId: id
      } as UserReview;

      const updatedReview = await this.userReviewsRepository.update(newUserReview);

      if (!updatedReview) throw new BadRequestException('review-not-updated');

      if (Array.isArray(reviewImages) && reviewImages.length > 0) {
        // deletar antigas
        await this.userReviewImagesService.removeByUserReviewId(reviewId);
        // salvar novas
        await this.userReviewImagesService.saveMany(reviewImages);
      }

      return updatedReview;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-update-review');
    }
  }

  public async deleteReview(reviewId: number, user: Partial<User>): Promise<void> {
    try {
      const { id } = user;

      const review = await this.userReviewsRepository.findOne({
        where: {
          id: reviewId
        }
      });

      if (!review) throw new NotFoundException('review-not-found');

      if (review.userId !== id) throw new UnauthorizedException('invalid-review');

      return this.userReviewsRepository.remove(review.id);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-delete-review');
    }
  }

  public async findImagesByUserId(userId: number): Promise<UserReviewImage[]> {
    try {
      const reviews = await this.userReviewsRepository.listAll({
        where: {
          userId: userId
        }
      });

      if (reviews.length === 0) return [];

      const reviewsIds = reviews.map(review => review.id);

      const images = await this.userReviewImagesService.listAll({
        where: {
          usersReviewId: In(reviewsIds)
        }
      });

      const data = [];
      images.map(image => {
        const review = reviews.find(review => review.id === image.usersReviewId);

        data.push({
          ...image,
          destinationId: review.destinationId
        });
      });

      return data;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('error-find-review-images');
    }
  }
}
