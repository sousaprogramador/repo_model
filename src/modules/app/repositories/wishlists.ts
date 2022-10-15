import { Injectable } from '@nestjs/common';
import { Chance } from 'chance';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { UsersRepository } from 'src/modules/app/repositories/users';
import { User } from 'src/modules/database/models/users.entity';
import { Wishlist } from 'src/modules/database/models/wishlists.entity';
import { FindOneOptions, getRepository, In, Not, SelectQueryBuilder } from 'typeorm';
import { GetWishlist } from '../validators/wishlist/get';

@Injectable()
export class WishlistsRepository {
  constructor(private usersRepository: UsersRepository) {}
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Wishlist>
  ): Promise<Pagination<Wishlist>> {
    return paginate<Wishlist>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Wishlist[]> {
    return Wishlist.find();
  }

  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Wishlist>> {
    return paginate<Wishlist>(
      getRepository(Wishlist),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['destination']
      }
    );
  }

  public async findByUserId(userId: number, params?: GetWishlist, userLoggedId?: Partial<User>) {
    if (params) {
      const { page, limit, type } = params;
      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      };
      console.log('userId', userId);
      const queryBuilder = getRepository(Wishlist)
        .createQueryBuilder('wishlists')
        .setParameter('userId', userId)
        .where('wishlists.userId = :userId')
        .andWhere('wishlists.status = true')
        .orderBy('wishlists.createdAt', 'DESC');

      if (type === 'offers') {
        queryBuilder.innerJoinAndSelect('wishlists.offer', 'offer');

        if (userLoggedId) {
          queryBuilder.loadRelationCountAndMap('offer.wishlisted', 'offer.wishlists', 'myWishOfferlists', qb =>
            qb.andWhere('myWishOfferlists.userId = :userLoggedId', { userLoggedId: userLoggedId })
          );
        }
        queryBuilder.andWhere('offer.status = true');
        queryBuilder.andWhere('offer.title IS NOT NULL');
      }

      if (type === 'destinations') {
        queryBuilder.innerJoinAndSelect('wishlists.destination', 'destination');

        if (userLoggedId) {
          queryBuilder.loadRelationCountAndMap('destination.wishlisted', 'destination.wishlists', 'myWishlists', qb =>
            qb.andWhere('myWishlists.userId = :userLoggedId', { userLoggedId: userLoggedId })
          );
        }
        queryBuilder.andWhere('destination.status = true');
        queryBuilder.andWhere('destination.name IS NOT NULL');
      }

      if (!!type === false) {
        queryBuilder.leftJoinAndSelect('wishlists.destination', 'destination');
        queryBuilder.leftJoinAndSelect('wishlists.offer', 'offer');

        if (userLoggedId) {
          queryBuilder.loadRelationCountAndMap(
            'destination.wishlisted',
            'destination.wishlists',
            'myDestinationWishlists',
            qb => qb.andWhere('myDestinationWishlists.userId = :userLoggedId', { userLoggedId: userLoggedId })
          );

          queryBuilder.loadRelationCountAndMap('offer.wishlisted', 'offer.wishlists', 'myOfferWishlists', qb =>
            qb.andWhere('myOfferWishlists.userId = :userLoggedId', { userLoggedId: userLoggedId })
          );
        }

        // TODO: Melhorar essa logica
        // Remover resultados status false
        queryBuilder.andWhere('(destination.status = true OR offer.status = true)');
        // Remover resultados com softdelete
        queryBuilder.andWhere('(destination.name IS NOT NULL OR offer.title IS NOT NULL)');
      }

      return await paginate<Wishlist>(queryBuilder, paginationOption);
    } else {
      return Wishlist.find({
        relations: ['destination', 'offer'],
        where: {
          userId
        }
      });
    }
  }

  public async getUsersByDestinations(
    destinationsIds: number[],
    userId: number,
    paginationOptions: IPaginationOptions,
    rand: number
  ): Promise<Pagination<User>> {
    const usersInterests = await Wishlist.find({
      where: {
        destinationId: In(destinationsIds),
        userId: Not(userId)
      }
    });
    const chance = new Chance(Number(rand));
    let usersId = usersInterests.map(userInterest => userInterest.userId);
    usersId = chance.shuffle(usersId);

    return this.usersRepository.listSortedBy(
      'id',
      usersId,
      paginationOptions,
      userId,
      rand || Math.floor(Math.random() * 1000)
    );
  }

  public async findById(id: number): Promise<Wishlist> {
    return Wishlist.findOne(id, {
      relations: ['destination']
    });
  }

  public async findOne(options: FindOneOptions<Wishlist>) {
    return Wishlist.findOne(options);
  }

  public async insert(model: Wishlist): Promise<Wishlist> {
    return Wishlist.save(model);
  }

  public async update(model: Wishlist): Promise<Wishlist> {
    return Wishlist.save(model);
  }
}
