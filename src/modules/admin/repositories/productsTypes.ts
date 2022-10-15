import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
import { ProductType } from '../../database/models/productsTypes.entity';

@Injectable()
export class ProductsTypesRepository {
  public async listAll(options: FindManyOptions<ProductType>): Promise<ProductType[]> {
    return ProductType.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<ProductType>
  ): Promise<Pagination<ProductType>> {
    return paginate<ProductType>(
      getRepository(ProductType),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  public async insert(model: ProductType): Promise<ProductType> {
    return ProductType.save(model);
  }
  public async findById(id: number): Promise<ProductType> {
    return ProductType.findOne(id);
  }
  public async update(model: ProductType): Promise<ProductType> {
    return ProductType.save(model);
  }
  public async remove(id: number): Promise<void> {
    await ProductType.delete(id);
  }
}
