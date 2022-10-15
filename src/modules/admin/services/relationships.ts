import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Relationship } from 'src/modules/database/models/relationships.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
import { RelationshipsRepository } from '../repositories/relationships';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ListRelationships } from '../validators/relationships/get';

@Injectable()
export class RelationshipsService {
  constructor(private relationshipsRepository: RelationshipsRepository) {}

  public async list(params: ListRelationships) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<Relationship>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Relationship>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.relationshipsRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.relationshipsRepository.listAll(options);
  }

  public async save(model: Relationship): Promise<Relationship> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: Relationship): Promise<Relationship> {
    console.log(model);
    try {
      const DestinationsCategory = await this.relationshipsRepository.insert(model);
      return DestinationsCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(relationshipsId: number): Promise<Relationship> {
    const preference = await this.relationshipsRepository.findById(relationshipsId);

    if (!preference) throw new NotFoundException('not-found');

    return preference;
  }

  private async update(model: Relationship): Promise<Relationship> {
    const preference = await this.relationshipsRepository.findById(model.id);
    if (!preference) throw new NotFoundException('not-found');

    return this.relationshipsRepository.update(model);
  }

  public async remove(relationshipsId: number): Promise<void> {
    const preference = await this.relationshipsRepository.findById(relationshipsId);

    if (!preference) {
      throw new NotFoundException('not-found');
    }

    return this.relationshipsRepository.remove(relationshipsId);
  }
}
