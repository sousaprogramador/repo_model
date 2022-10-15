import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { OffersRepository } from 'src/modules/admin/repositories/offers';
import { PartnersRepository } from 'src/modules/admin/repositories/partners';
import { Offer } from 'src/modules/database/models/offers.entity';
import { FindConditions, FindManyOptions, Like } from 'typeorm';
import { ListOffers } from '../validators/offers/get';
import { CreateOffers } from '../validators/offers/save';
@Injectable()
export class OffersService {
  constructor(private offerRepository: OffersRepository, private partnersRepository: PartnersRepository) {}

  public async list(params: ListOffers) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Offer>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Offer>;

    if (rest.search) where.title = Like(`%${rest.search}%`);

    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.offerRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.offerRepository.listAll(options);
  }

  public async save(model: CreateOffers): Promise<Offer> {
    if (model.tags && Array.isArray(model.tags)) model.tags = model.tags.join(',');

    if (model.id) return this.update(model);

    return this.create(model);
  }

  private async create(model: CreateOffers): Promise<Offer> {
    let destinationsId: number[] = [];
    let interestsId: number[] = [];
    let partnersId: number[] = [];
    let productsTypesId: number[] = [];
    let categoriesId: number[] = [];

    if (model.destinations) {
      destinationsId = model.destinations.map<number>(destination => {
        // if (destination?.id) return destination.id;

        return destination;
      });
      delete model.destinations;
    }

    if (model.interests) {
      interestsId = model.interests.map<number>(interest => {
        // if (destination?.id) return destination.id;

        return interest;
      });
      delete model.interests;
    }

    if (model.partners) {
      partnersId = model.partners.map<number>(interest => {
        // if (destination?.id) return destination.id;

        return interest;
      });
      delete model.partners;
    }
    if (model.categories) {
      categoriesId = model.categories.map<number>(category => category);
      delete model.categories;
    }
    if (model.productsTypes) {
      productsTypesId = [...model.productsTypes];
      delete model.productsTypes;
    }

    try {
      const offer = await this.offerRepository.insert(model);

      if (offer && destinationsId.length > 0) {
        await this.offerRepository.updateDestinations(offer.id, destinationsId);
      }

      if (offer && interestsId.length > 0) {
        await this.offerRepository.updateInterests(offer.id, interestsId);
      }

      if (offer && partnersId.length > 0) {
        await this.offerRepository.updatePartners(offer.id, partnersId);
      }

      if (offer && categoriesId.length > 0) {
        await this.offerRepository.updateCategories(offer.id, categoriesId);
      }

      if (offer && productsTypesId.length > 0) {
        await this.offerRepository.updateProductsTypes(offer.id, productsTypesId);
      }

      return offer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(offerId: number): Promise<Offer> {
    const offer = await this.offerRepository.findById(offerId);

    if (!offer) throw new NotFoundException('not-found');

    return offer;
  }

  private async update(model: CreateOffers): Promise<Offer> {
    const offer = await this.offerRepository.findById(model.id);

    if (!offer) throw new NotFoundException('not-found');

    let destinationsId: number[] = [];
    let interestsId: number[] = [];
    let partnersId: number[] = [];
    let productsTypesId: number[] = [];

    if (model.destinations) {
      destinationsId = model.destinations.map<number>(destination => {
        // if (destination?.id) return destination.id;

        return destination;
      });
      delete model.destinations;
    }

    if (model.interests) {
      interestsId = model.interests.map<number>(interest => {
        // if (destination?.id) return destination.id;

        return interest;
      });
      delete model.interests;
    }

    if (model.partners) {
      partnersId = model.partners.map<number>(interest => {
        // if (destination?.id) return destination.id;

        return interest;
      });
      delete model.partners;
    }

    let categoriesId: number[] = [];

    if (model.categories) {
      categoriesId = model.categories.map<number>(category => category);
      delete model.categories;
    }
    if (model.productsTypes) {
      productsTypesId = [...model.productsTypes];
      delete model.productsTypes;
    }

    if (offer.id && destinationsId.length >= 0) {
      await this.offerRepository.updateDestinations(offer.id, destinationsId);
    }
    if (offer && interestsId.length >= 0) {
      await this.offerRepository.updateInterests(offer.id, interestsId);
    }
    if (offer && partnersId.length >= 0) {
      await this.offerRepository.updatePartners(offer.id, partnersId);
    }

    if (offer && categoriesId.length >= 0) {
      await this.offerRepository.deleteCategoriesByOfferId(offer.id);

      await this.offerRepository.updateCategories(offer.id, categoriesId);
    }
    if (offer && productsTypesId.length >= 0) {
      await this.offerRepository.deleteProductsTypes(offer.id);

      await this.offerRepository.updateProductsTypes(offer.id, productsTypesId);
    }

    return this.offerRepository.update(model);
  }

  public async remove(offerId: number): Promise<void> {
    const offer = await this.offerRepository.findById(offerId);

    if (!offer) {
      throw new NotFoundException('not-found');
    }

    return this.offerRepository.remove(offerId);
  }
}
