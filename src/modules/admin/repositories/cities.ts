import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { City } from 'src/modules/database/models/cities.entity';
import { FindConditions, FindManyOptions, getRepository } from 'typeorm';

@Injectable()
export class CitiesRepository {
  public async listAll(options: FindManyOptions<City>): Promise<City[]> {
    return City.find({
      relations: ['state'],
      ...options
    });
  }
  public async list(paginationOptions: IPaginationOptions, options: FindManyOptions<City>): Promise<Pagination<City>> {
    return paginate<City>(
      getRepository(City),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        relations: ['state'],
        ...options
      }
    );
  }

  public async insert(model: City): Promise<City> {
    return City.save(model);
  }

  public async findById(id: number): Promise<City> {
    return City.findOne(id, {
      relations: ['state']
    });
  }
  public async findOne(where: FindConditions<City>): Promise<City> {
    return City.findOne({
      relations: ['state', 'state.country'],
      where
    });
  }

  public async update(model: City): Promise<City> {
    return City.save(model);
  }

  public async remove(id: number): Promise<void> {
    await City.delete(id);

    // const city = await City.findOne(id);

    // if (city.deletedAt) {
    //   city.updatedAt = null;
    // } else {
    //   city.updatedAt = new Date();
    // }
    // await city.save();
  }
}
