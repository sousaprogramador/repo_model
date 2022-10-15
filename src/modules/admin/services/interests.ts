import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Interest } from 'src/modules/database/models/interests.entity';
import { FindConditions, FindManyOptions, Like } from 'typeorm';
import { ListInterests } from '../validators/interests/get';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InterestsRepository } from './../repositories/interests';

@Injectable()
export class InterestsService {
  constructor(private interestsRepository: InterestsRepository) {}

  public async list(params: ListInterests) {
    const { page, limit, search, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Interest>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Interest>;

    if (search) where.name = Like(`%${search}%`);
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.interestsRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.interestsRepository.listAll(options);
  }

  public async save(model: Interest): Promise<Interest> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: Interest): Promise<Interest> {
    console.log(model);
    try {
      const DestinationsCategory = await this.interestsRepository.insert(model);
      return DestinationsCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(interestsId: number): Promise<Interest> {
    const interest = await this.interestsRepository.findById(interestsId);

    if (!interest) throw new NotFoundException('not-found');

    return interest;
  }

  private async update(model: Interest): Promise<Interest> {
    const interest = await this.interestsRepository.findById(model.id);
    if (!interest) throw new NotFoundException('not-found');

    return this.interestsRepository.update(model);
  }

  public async remove(interestsId: number): Promise<void> {
    const lead = await this.interestsRepository.findById(interestsId);

    if (!lead) {
      throw new NotFoundException('not-found');
    }

    return this.interestsRepository.remove(interestsId);
  }
}
