import { Injectable } from '@nestjs/common';
import { Preference } from 'src/modules/database/models/preferences.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';
@Injectable()
export class PreferencesRepository {
  public async listAll(options: FindManyOptions<Preference>): Promise<Preference[]> {
    return Preference.find(options);
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Preference>
  ): Promise<Pagination<Preference>> {
    return paginate<Preference>(
      getRepository(Preference),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }
  async findById(id: number): Promise<Preference> {
    return Preference.findOne(id);
  }

  async insert(model: Preference): Promise<Preference> {
    return Preference.save(model);
  }

  async update(model: Preference): Promise<Preference> {
    return Preference.save(model);
  }

  async remove(id: number): Promise<void> {
    await Preference.delete(id);
  }
}
