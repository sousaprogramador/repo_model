import { Injectable } from '@nestjs/common';
import { Country } from 'src/modules/database/models/countries.entity';
import { paginate, Pagination, IPaginationOptions, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class CountriesRepository {
  public async listAll(options: FindManyOptions<Country>): Promise<Country[]> {
    return Country.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Country>
  ): Promise<Pagination<Country>> {
    // outras verificações

    return paginate<Country>(
      getRepository(Country),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }

  public async insert(model: Country): Promise<Country> {
    return Country.save(model);
  }

  public async findById(id: number): Promise<Country> {
    return Country.findOne(id);
  }

  public async update(model: Country): Promise<Country> {
    return Country.save(model);
  }

  public async remove(id: number): Promise<void> {
    await Country.delete(id);
  }
}
