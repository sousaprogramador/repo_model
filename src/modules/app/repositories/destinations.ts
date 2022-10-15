import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { DestinationImage } from 'src/modules/database/models/destinationsImages.entity';
import { Offer } from 'src/modules/database/models/offers.entity';
import { User } from 'src/modules/database/models/users.entity';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';
import { Wishlist } from 'src/modules/database/models/wishlists.entity';
import { getRepository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class DestinationRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Destination>
  ): Promise<Pagination<Destination>> {
    //   return paginate<Destination>(selectQueryBuilder, {
    //     ...paginationOptions,
    //     paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    //   });

    const page = Number(paginationOptions.page) || 1;
    const limit = Number(paginationOptions.limit) || 10;

    const [items, count] = await selectQueryBuilder
      // .orderBy('destinations.createdAt', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit)
      .getManyAndCount();

    return {
      items: items,
      meta: {
        totalItems: count,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    };
  }

  public async findById(id: number, userLogged?: Partial<User>): Promise<Destination> {
    const queryBuilder = getRepository(Destination)
      .createQueryBuilder('destination')
      .leftJoinAndSelect('destination.city', 'city')
      .leftJoinAndSelect('city.state', 'state')
      .leftJoinAndSelect('state.country', 'country')
      .leftJoinAndSelect('destination.categories', 'categories')
      .loadRelationCountAndMap('destination.reviewsCount', 'destination.reviews')
      .loadRelationCountAndMap('destination.offersCount', 'destination.offers')
      .loadRelationCountAndMap('destination.wishlistsCount', 'destination.wishlists')
      .loadRelationCountAndMap('destination.imagesCount', 'destination.images')
      .where('destination.status = 1')
      .andWhere('destination.id = :id', { id });
    // .leftJoinAndSelect('destination.images', 'images')
    // .leftJoinAndSelect('destination.offers', 'offers')
    // .leftJoinAndSelect('destination.wishlists', 'wishlists')
    // .leftJoinAndSelect('destination.reviews', 'reviews')
    // .leftJoinAndSelect('reviews.user', 'user')
    // .leftJoinAndSelect('reviews.images', 'imagesReviews')
    // .leftJoinAndSelect('wishlists.user', 'users')
    // .orderBy('offers.createdAt', 'DESC');

    if (userLogged) {
      queryBuilder.loadRelationCountAndMap('destination.wishlisted', 'destination.wishlists', 'myWishlists', qb =>
        qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
      );

      queryBuilder.loadRelationCountAndMap('destination.visited', 'destination.reviews', 'myReviews', qb =>
        qb.andWhere('myReviews.userId = :userId', { userId: userLogged.id })
      );
    }

    const destination = await queryBuilder.getOne();

    if (!destination) return null;

    const images = await getRepository(DestinationImage)
      .createQueryBuilder('destinationImages')
      .setParameter('destinationId', destination.id)
      .where('destinationImages.destinationId = :destinationId')
      .limit(10)
      .getMany();

    const reviews = await getRepository(UserReview)
      .createQueryBuilder('reviews')
      .distinct(true)
      .leftJoinAndSelect('reviews.images', 'imagesReviews')
      .leftJoinAndSelect('reviews.user', 'userReview')
      .setParameter('destinationId', destination.id)
      .where('reviews.destinationId = :destinationId')
      .limit(10)
      .getMany();

    const wishlists = await getRepository(Wishlist)
      .createQueryBuilder('wishlists')
      .setParameter('destinationId', destination.id)
      .leftJoinAndSelect('wishlists.user', 'userWishlist')
      .where('wishlists.destinationId = :destinationId')
      .limit(10)
      .getMany();

    const offers = await getRepository(Offer)
      .createQueryBuilder('offers')
      .andWhere('offers.startDate <= CURRENT_TIME() AND offers.endDate >= CURRENT_TIME()')
      .setParameter('destinationId', destination.id)
      .innerJoin('offers.destinations', 'destination', 'destination.id = :destinationId')
      .limit(10)
      .orderBy('offers.createdAt', 'DESC')
      .getMany();

    return {
      ...destination,
      wishlists,
      offers,
      reviews,
      images
    } as Destination;
  }
}
