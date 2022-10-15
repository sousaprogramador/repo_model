import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Chance } from 'chance';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { OffersRepository } from 'src/modules/app/repositories/offers';
import { Offer } from 'src/modules/database/models/offers.entity';
import { User } from 'src/modules/database/models/users.entity';
import { getRepository } from 'typeorm';
import { ListOffer, ListOfferCustom } from '../validators/offers/get';
import { UsersService } from './users';

@Injectable()
export class OffersService {
  logger: Logger;
  constructor(private offerRepository: OffersRepository, private usersService: UsersService) {
    this.logger = new Logger();
  }

  public async list(params: ListOfferCustom, userLogged?: Partial<User>) {
    try {
      const { page, limit, rand, ...rest } = params;
      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      const queryBuilder = getRepository(Offer)
        .createQueryBuilder('offers')
        .distinct(true)
        .leftJoinAndSelect('offers.partners', 'partners')
        .leftJoinAndSelect('offers.destinations', 'destinations')
        .leftJoinAndSelect('offers.interests', 'interests')
        .leftJoinAndSelect('offers.categories', 'offerCategories')
        .leftJoinAndSelect('offers.productsTypes', 'productsTypes', 'productsTypes.status = true')
        .where('offers.deletedAt IS NULL')
        .andWhere('offers.status = true')
        .andWhere('offers.startDate <= CURRENT_TIME() AND offers.endDate >= CURRENT_TIME()');

      if (userLogged) {
        queryBuilder.loadRelationCountAndMap('offers.wishlisted', 'offers.wishlists', 'myWishlists', qb =>
          qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
        );
      }

      if (rest.startDate) {
        queryBuilder.andWhere('offers.startDate >= :startDate', { startDate: rest.startDate });
      }

      if (rest.endDate) {
        queryBuilder.andWhere('offers.endDate <= :endDate', { endDate: rest.endDate });
      }

      if (Array.isArray(rest.categories) && rest.categories.length > 0) {
        queryBuilder.andWhere('offerCategories.id IN (:...categories)', {
          categories: rest.categories.map(value => Number(value))
        });
      } else if (typeof rest.categories === 'string') {
        queryBuilder.andWhere('offerCategories.id IN (:categories)', {
          categories: Number(rest.categories)
        });
      }

      if (Array.isArray(rest.interests) && rest.interests.length > 0) {
        queryBuilder.andWhere('interests.id IN (:interests)', {
          interests: rest.interests.filter((i, p) => rest.interests.indexOf(i) == p).toString()
        });
      } else if (typeof rest.interests === 'string') {
        queryBuilder.andWhere('interests.id IN (:interests)', {
          interestId: rest.interests
        });
      }

      if (Array.isArray(rest.destinations) && rest.destinations.length > 0) {
        queryBuilder.andWhere('destinations.id IN (:destinations)', {
          destinations: rest.destinations.filter((i, p) => rest.destinations.indexOf(i) === p).toString()
        });
      } else if (typeof rest.destinations === 'string') {
        queryBuilder.andWhere('destinations.id IN (:destinations)', {
          destinations: rest.destinations
        });
      }

      if (Array.isArray(rest.partners) && rest.partners.length > 0) {
        queryBuilder.andWhere('partners.id IN (:partners)', {
          partners: rest.partners.filter((i, p) => rest.partners.indexOf(i) === p).toString()
        });
      } else if (typeof rest.partners === 'string') {
        queryBuilder.andWhere('partners.id IN (:partners)', {
          partners: rest.partners
        });
      }

      if (rest.title) {
        queryBuilder
          .andWhere('offers.title LIKE :title', {
            title: `%${rest.title}%`
          })
          .orderBy(
            `(CASE WHEN offers_title LIKE "${rest.title}%" THEN 1 WHEN offers_title LIKE "%${rest.title}%" THEN 2 END)`
          );
      } else {
        queryBuilder.orderBy(`RAND(${rand})`);
      }

      return this.offerRepository.paginate(paginationOption, queryBuilder);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('list-offers-failed');
    }
  }

  public async findById(offerId: number, userLogged: Partial<User>): Promise<Offer> {
    const offer = await this.offerRepository.findById(offerId, userLogged);

    if (!offer) throw new NotFoundException('not-found');

    return offer;
  }

  public async listByInterests(params: ListOffer, userLogged: Partial<User>) {
    const userId = userLogged.id;

    const { page, limit, rand, ...rest } = params;

    const paginationOption: IPaginationOptions = {
      page: page || 1,
      limit: limit || 10
    } as IPaginationOptions;

    const user = await this.usersService.findById(userId);

    const chance = new Chance(Number(rand));

    let userInterestsId = user.interests.map<number>(interest => interest.id);

    userInterestsId = chance.shuffle(userInterestsId);

    const queryBuilder = getRepository(Offer)
      .createQueryBuilder('offers')
      .distinct(true)
      .leftJoinAndSelect('offers.partners', 'partners')
      .leftJoinAndSelect('offers.destinations', 'destinations')
      .leftJoinAndSelect('offers.interests', 'interests')
      .leftJoinAndSelect('offers.categories', 'categories')
      .leftJoinAndSelect('offers.productsTypes', 'productsTypes', 'productsTypes.status = true')
      .where('offers.deletedAt IS NULL')
      .andWhere('offers.status = true')
      .andWhere('offers.startDate <= CURRENT_TIME() AND offers.endDate >= CURRENT_TIME()');

    if (userLogged) {
      queryBuilder.loadRelationCountAndMap('offers.wishlisted', 'offers.wishlists', 'myWishlists', qb =>
        qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
      );
    }

    if (rest.startDate) {
      queryBuilder.andWhere('offers.startDate >= :startDate', { startDate: rest.startDate });
    }

    if (rest.endDate) {
      queryBuilder.andWhere('offers.endDate <= :endDate', { endDate: rest.endDate });
    }

    if (rest.title) {
      queryBuilder
        .andWhere('offers.title LIKE :title', {
          title: `%${rest.title}%`
        })
        .orderBy(
          `(CASE WHEN offers_title LIKE "${rest.title}%" THEN 1 WHEN offers_title LIKE "%${rest.title}%" THEN 2 END)`
        );
      // .orderBy('offers.title', 'ASC');
    } else {
      queryBuilder.orderBy(
        Array.isArray(userInterestsId) && userInterestsId.length > 0
          ? `IF(FIELD(interests_id,${userInterestsId.toString()})=0,1,0),FIELD(interests_id,${userInterestsId.toString()})`
          : `RAND(${rand})`
      );
    }

    return this.offerRepository.paginate(paginationOption, queryBuilder);
  }
}
