import { Injectable, NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProductsTypesRepository } from '../repositories/productsTypes';
import { ProductType } from '../../database/models/productsTypes.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ListProductsTypes } from '../validators/productsTypes/get';
import { FindConditions, FindManyOptions } from 'typeorm';

@Injectable()
export class ProductsTypesService {
  constructor(private offersCategoriesRepository: ProductsTypesRepository) {}

  public async list(params: ListProductsTypes) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<ProductType>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<ProductType>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.offersCategoriesRepository.list(paginationOption, options);
    }

    return this.offersCategoriesRepository.listAll(options);
  }

  public async save(model: ProductType): Promise<ProductType> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: ProductType): Promise<ProductType> {
    try {
      const ProductType = await this.offersCategoriesRepository.insert(model);
      return ProductType;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async update(model: ProductType): Promise<ProductType> {
    const ProductType = await this.offersCategoriesRepository.findById(model.id);
    if (!ProductType) throw new NotFoundException('not-found');

    return this.offersCategoriesRepository.update(model);
  }

  public async findById(offersCategoriesId: number): Promise<ProductType> {
    const offerCategory = await this.offersCategoriesRepository.findById(offersCategoriesId);
    if (!offerCategory) throw new NotFoundException('not-found');

    return offerCategory;
  }

  public async remove(offersCategoriesId: number): Promise<void> {
    const lead = await this.offersCategoriesRepository.findById(offersCategoriesId);

    if (!lead) {
      throw new NotFoundException('not-found');
    }

    return this.offersCategoriesRepository.remove(offersCategoriesId);
  }
}
