import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindConditions, FindManyOptions, IsNull, Not } from 'typeorm';
import { OffersCategory } from '../../database/models/offersCategories.entity';
import { OffersCategoriesRepository } from '../repositories/offersCategories';
import { ListOfferCategories } from '../validators/offersCategories/get';

@Injectable()
export class OffersCategoriesService {
  constructor(private offersCategoriesRepository: OffersCategoriesRepository) {}

  public async list(params: ListOfferCategories) {
    const { page, limit } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<OffersCategory>;

    options.order = {
      position: 'ASC'
    };

    const where = {
      position: Not(IsNull()),
      status: true
    } as FindConditions<OffersCategory>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.offersCategoriesRepository.list(paginationOption, options);
    }

    return this.offersCategoriesRepository.listAll(options);
  }

  public async findById(offersCategoriesId: number): Promise<OffersCategory> {
    const offerCategory = await this.offersCategoriesRepository.findById(offersCategoriesId);
    if (!offerCategory) throw new NotFoundException('not-found');

    return offerCategory;
  }
}
