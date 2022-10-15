import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Chance } from 'chance';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DestinationRepository } from 'src/modules/app/repositories/destinations';
import { OffersRepository } from 'src/modules/app/repositories/offers';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { Offer } from 'src/modules/database/models/offers.entity';
import { User } from 'src/modules/database/models/users.entity';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';
import { getRepository } from 'typeorm';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListDestination } from '../validators/destinations/get';
import { UserReviewsRepository } from './../repositories/userReview';
import { UsersService } from './users';

@Injectable()
export class DestinationService {
  logger: Logger;
  constructor(
    private destinationRepository: DestinationRepository,
    private usersService: UsersService,
    private offersRepository: OffersRepository,
    private userReviewsRepository: UserReviewsRepository
  ) {
    this.logger = new Logger('DestinationService');
  }

  public async list(params: ListDestination, userLogged?: Partial<User>) {
    try {
      const { page, limit, rand, ...rest } = params;

      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      const queryBuilder = getRepository(Destination)
        .createQueryBuilder('destinations')
        .distinct(true)
        .loadRelationCountAndMap('destinations.reviewsCount', 'destinations.reviews')
        .loadRelationCountAndMap('destinations.offersCount', 'destinations.offers')
        .leftJoin('destinations.interests', 'interests')
        .leftJoinAndSelect('destinations.city', 'city')
        .leftJoinAndSelect('city.state', 'state')
        .leftJoinAndSelect('state.country', 'country')
        .leftJoinAndSelect('destinations.images', 'images')
        .leftJoinAndSelect('destinations.categories', 'categories')
        .where('destinations.status = true');

      if (userLogged) {
        queryBuilder.loadRelationCountAndMap('destinations.wishlisted', 'destinations.wishlists', 'myWishlists', qb =>
          qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
        );

        queryBuilder.loadRelationCountAndMap('destinations.visited', 'destinations.reviews', 'myReviews', qb =>
          qb.andWhere('myReviews.userId = :userId', { userId: userLogged.id })
        );
      }

      if (rest.cityId) {
        queryBuilder.andWhere('destinations.cityId = :cityId', {
          cityId: rest.cityId
        });
      }

      //  Filtro OR
      // if (rest.interests && Array.isArray(rest.interests) && rest.interests.length > 0) {
      //   queryBuilder
      //     .leftJoin('destinations.interests', 'destinationsInterests')
      //     .andWhere(`destinationsInterests.id IN (:interests)`, { interests: rest.interests.toString() })
      //     .getMany();
      // } else if (rest.interests && typeof rest.interests === 'string' && rest.interests !== '') {
      //   queryBuilder
      //     .leftJoin('destinations.interests', 'destinationsInterests')
      //     .andWhere(`destinationsInterests.id IN (:interests)`, { interests: rest.interests })
      //     .getMany();
      // }

      // Filtro AND
      if (rest.interests && Array.isArray(rest.interests) && rest.interests.length > 0) {
        queryBuilder.leftJoin('destinations.interests', 'destinationsInterests');
        rest.interests.forEach(interest => {
          if (!!interest === true && interest !== '') {
            queryBuilder.andWhere(`destinationsInterests.id = :interest`, { interest });
          }
        });
      } else if (rest.interests && typeof rest.interests === 'string' && rest.interests !== '') {
        queryBuilder.andWhere(`interests.id IN (:interests)`, { interests: rest.interests });
      }

      if (rest.name) {
        queryBuilder
          .andWhere('destinations.name LIKE :name', {
            name: `%${rest.name}%`
          })
          .orWhere('city.name LIKE :name', {
            name: `%${rest.name}%`
          })
          .orderBy(
            `(CASE WHEN destinations_name LIKE "${rest.name}%" THEN 1 WHEN destinations_name LIKE "%${rest.name}%" THEN 2 WHEN city_name LIKE "${rest.name}%" THEN 3 WHEN city_name LIKE "%${rest.name}%" THEN 4 END)`
          );
      } else {
        queryBuilder.orderBy(`RAND(${rand})`);
      }

      return this.destinationRepository.paginate(paginationOption, queryBuilder);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('list-destiantions-failed');
    }
  }

  public async listByInterests(params: ListDestination, userLogged: Partial<User>) {
    const { page, limit, rand, ...rest } = params;

    const paginationOption: IPaginationOptions = {
      page: page || 1,
      limit: limit || 10
    } as IPaginationOptions;

    const queryBuilder = getRepository(Destination)
      .createQueryBuilder('destinations')
      .distinct(true)
      .loadRelationCountAndMap('destinations.reviewsCount', 'destinations.reviews')
      .loadRelationCountAndMap('destinations.offersCount', 'destinations.offers')
      .leftJoin('destinations.interests', 'interests')
      .leftJoinAndSelect('destinations.city', 'city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('state.country', 'country')
      .leftJoinAndSelect('destinations.images', 'images')
      .leftJoinAndSelect('destinations.categories', 'categories')
      .where('destinations.status = true');

    if (userLogged) {
      queryBuilder.loadRelationCountAndMap('destinations.wishlisted', 'destinations.wishlists', 'myWishlists', qb =>
        qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
      );

      queryBuilder.loadRelationCountAndMap('destinations.visited', 'destinations.reviews', 'myReviews', qb =>
        qb.andWhere('myReviews.userId = :userId', { userId: userLogged.id })
      );
    }

    const user = await this.usersService.findById(userLogged?.id);

    const chance = new Chance(Number(rand));

    let userInterestsId = user.interests.map<number>(interest => interest.id);

    userInterestsId = chance.shuffle(userInterestsId);

    if (rest.cityId) {
      queryBuilder.andWhere('destinations.cityId = :cityId', {
        cityId: rest.cityId
      });
    }

    if (rest.name) {
      queryBuilder
        .andWhere('destinations.name LIKE :name', {
          name: `%${rest.name}%`
        })
        .orWhere('city.name LIKE :name', {
          name: `%${rest.name}%`
        })
        .orderBy(
          `(CASE WHEN destinations_name LIKE "${rest.name}%" THEN 1 WHEN destinations_name LIKE "%${rest.name}%" THEN 2 WHEN city_name LIKE "${rest.name}%" THEN 3 WHEN city_name LIKE "%${rest.name}%" THEN 4 END)`
        );
    } else {
      queryBuilder.orderBy(
        Array.isArray(userInterestsId) && userInterestsId.length > 0
          ? `IF(FIELD(interests.id,${userInterestsId.toString()})=0,1,0),FIELD(interests.id,${userInterestsId.toString()})`
          : `RAND(${rand})`
      );
    }

    return this.destinationRepository.paginate(paginationOption, queryBuilder);
  }

  public async findById(destinationId: number, userLogged?: Partial<User>): Promise<Destination> {
    const destination = await this.destinationRepository.findById(destinationId, userLogged);

    if (!destination) throw new NotFoundException('not-found');

    return destination;
  }

  public async findOffers(
    destinationId: number,
    query: PaginationQuery,
    userLogged: Partial<User>
  ): Promise<Offer[] | Promise<Pagination<Offer>>> {
    const destination = await this.destinationRepository.findById(destinationId);

    if (!destination) throw new NotFoundException('not-found');

    const queryBuilder = getRepository(Offer)
      .createQueryBuilder('offers')
      .distinct(true)
      .orderBy('offers.createdAt', 'DESC')
      .leftJoinAndSelect('offers.destinations', 'destinations')
      .where('offers.deletedAt IS NULL')
      .andWhere('destinations.status = true')
      .andWhere('destinations.id = :destinationId', {
        destinationId
      })
      .andWhere('offers.startDate <= CURRENT_TIME() AND offers.endDate >= CURRENT_TIME()');

    if (userLogged) {
      queryBuilder.loadRelationCountAndMap('offers.wishlisted', 'offers.wishlists', 'myWishlists', qb =>
        qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
      );
    }

    const paginationOptions = {
      page: query.page || 1,
      limit: query.limit || 10
    };

    return this.offersRepository.paginate(paginationOptions, queryBuilder);
  }

  public async findReviews(
    destinationId: number,
    userLogged: Partial<User>,
    query: PaginationQuery
  ): Promise<UserReview[] | Promise<Pagination<UserReview>>> {
    const destination = await this.destinationRepository.findById(destinationId);

    if (!destination) throw new NotFoundException('not-found');

    const queryBuilder = getRepository(UserReview)
      .createQueryBuilder('userReviews')
      .distinct(true)
      .leftJoinAndSelect('userReviews.images', 'images')
      .leftJoinAndSelect('userReviews.user', 'user')
      .where('destinationId = :destinationId', { destinationId })
      .andWhere('userReviews.status = true');

    const paginationOptions = {
      page: query.page || 1,
      limit: query.limit || 10
    };

    return this.userReviewsRepository.paginate(paginationOptions, queryBuilder);
  }
}
