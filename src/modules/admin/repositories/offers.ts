import { Injectable } from '@nestjs/common';
import { Offer } from 'src/modules/database/models/offers.entity';
import { OfferHasDestinations } from 'src/modules/database/models/offerHasDestinations.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
import { OfferHasInterests } from 'src/modules/database/models/offerHasInterests.entity';
import { OfferHasPartners } from 'src/modules/database/models/offerHasPartners.entity';
import { OffersHasCategories } from 'src/modules/database/models/offersHasCategories.entity';
import { OfferHasProductType } from 'src/modules/database/models/offerHasProductsTypes.entity';
@Injectable()
export class OffersRepository {
  public async listAll(options: FindManyOptions<Offer>): Promise<Offer[]> {
    return Offer.find(options);
  }

  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Offer>
  ): Promise<Pagination<Offer>> {
    return paginate<Offer>(
      getRepository(Offer),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['partners', 'destinations', 'interests', 'categories', 'productsTypes'],
        ...options
      }
    );
  }

  async findById(id: number): Promise<Offer> {
    return Offer.findOne(id, {
      relations: ['partners', 'destinations', 'interests', 'categories', 'productsTypes']
    });
  }

  async insert(model: Offer): Promise<Offer> {
    return Offer.save(model);
  }

  async update(model: Offer): Promise<Offer> {
    return Offer.save(model);
  }

  async remove(id: number): Promise<void> {
    await Offer.delete(id);
  }

  public async updatePartners(offerId: number, partnersId: number[]): Promise<void> {
    await OfferHasPartners.delete({ offerId });

    partnersId.map(async partnerId => {
      await OfferHasPartners.insert({
        offerId,
        partnerId
      });
    });
  }

  public async updateInterests(offerId: number, interestsId: number[]): Promise<void> {
    await OfferHasInterests.delete({ offerId });

    interestsId.map(async interestId => {
      await OfferHasInterests.insert({
        offerId,
        interestId
      });
    });
  }

  public async updateDestinations(offerId: number, destinationsId: number[]): Promise<void> {
    await OfferHasDestinations.delete({ offerId });

    destinationsId.map(async destinationId => {
      await OfferHasDestinations.insert({
        offerId,
        destinationId
      });
    });
  }

  public async deleteCategoriesByOfferId(offerId: number): Promise<void> {
    await OffersHasCategories.delete({ offerId });
  }

  public async updateCategories(offerId: number, categoriesId: number[]): Promise<void> {
    categoriesId.map(async categoryId => {
      await OffersHasCategories.insert({
        categoryId,
        offerId
      });
    });
  }

  public async deleteProductsTypes(offerId: number): Promise<void> {
    await OfferHasProductType.delete({ offerId });
  }

  public async updateProductsTypes(offerId: number, productsTypes: number[]): Promise<void> {
    productsTypes.map(async productTypeId => {
      await OfferHasProductType.insert({
        productTypeId,
        offerId
      });
    });
  }
}
