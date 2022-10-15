import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { DestinationImage } from 'src/modules/database/models/destinationsImages.entity';
import { Offer } from 'src/modules/database/models/offers.entity';
import { User } from 'src/modules/database/models/users.entity';
import { getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class OffersRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Offer>
  ): Promise<Pagination<Offer>> {
    return paginate<Offer>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  async findById(id: number, userLogged?: Partial<User>): Promise<Offer> {
    const queryBuilder = getRepository(Offer)
      .createQueryBuilder('offer')
      .where('offer.id = :offerId', {
        offerId: id
      })
      .andWhere('offer.startDate <= CURRENT_TIME() AND offer.endDate >= CURRENT_TIME()');

    if (userLogged) {
      queryBuilder
        .leftJoinAndSelect('offer.partners', 'partners')
        .leftJoinAndSelect('offer.destinations', 'destinations')
        .leftJoinAndSelect('offer.interests', 'interests')
        .leftJoinAndSelect('offer.categories', 'categories')
        .leftJoinAndSelect('offer.productsTypes', 'productsTypes');

      queryBuilder.loadRelationCountAndMap('offer.wishlisted', 'offer.wishlists', 'myWishlists', qb =>
        qb.andWhere('myWishlists.userId = :userId', { userId: userLogged.id })
      );
    }
    const offer = await queryBuilder.getOne();

    return { ...offer, images: await this.getDestinationImages(offer.destinations as Destination[]) } as Offer;
  }

  private async getDestinationImages(destinations: Destination[]): Promise<DestinationImage[] | string[]> {
    const images: any[] = [];

    if (!destinations) return images;

    for await (const destination of destinations) {
      const destinationsImages = await getRepository(DestinationImage)
        .createQueryBuilder('destinationImages')
        .where('destinationImages.destinationId = :destinationId', {
          destinationId: destination.id
        })
        .getMany();
      // add destinationImages to images
      images.push(...destinationsImages);
    }

    return images.sort(() => Math.random() - 0.5).slice(0, 10);
  }
}
