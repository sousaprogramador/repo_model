import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Preference } from 'src/modules/database/models/preferences.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PreferencesRepository } from '../repositories/preferences';
import { ListPreferences } from '../validators/preferences/get';

@Injectable()
export class PreferencesService {
  constructor(private preferencesRepository: PreferencesRepository) {}

  public async list(params: ListPreferences) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Preference>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Preference>;
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.preferencesRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.preferencesRepository.listAll(options);
  }

  public async save(model: Preference): Promise<Preference> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: Preference): Promise<Preference> {
    console.log(model);
    try {
      const DestinationsCategory = await this.preferencesRepository.insert(model);
      return DestinationsCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(preferencesId: number): Promise<Preference> {
    const preference = await this.preferencesRepository.findById(preferencesId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  private async update(model: Preference): Promise<Preference> {
    const preference = await this.preferencesRepository.findById(model.id);
    if (!preference) throw new NotFoundException('not-found');

    return this.preferencesRepository.update(model);
  }

  public async remove(preferencesId: number): Promise<void> {
    const preference = await this.preferencesRepository.findById(preferencesId);

    if (!preference) {
      throw new NotFoundException('not-found');
    }

    return this.preferencesRepository.remove(preferencesId);
  }
}
