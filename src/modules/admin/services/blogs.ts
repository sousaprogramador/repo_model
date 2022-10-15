import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Blog } from 'src/modules/database/models/blogs.entity';
import { FindConditions, FindManyOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BlogsRepository } from '../repositories/blogs';
import { ListBlogs } from '../validators/blogs/get';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  public async list(params: ListBlogs) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<Blog>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Blog>;
    // os dados de busca
    options.where = where;
    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.blogsRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.blogsRepository.listAll(options);
  }

  public async save(model: Blog): Promise<Blog> {
    if (model.id) return this.update(model);
    return this.create(model);
  }

  private async create(model: Blog): Promise<Blog> {
    let destinationsId: number[] = [];

    if (model.destinations) {
      destinationsId = model.destinations.map<number>(destination => {
        if (destination?.id) return destination.id;

        return destination;
      });
      delete model.destinations;
    }
    try {
      const blog = await this.blogsRepository.insert(model);

      if (blog && destinationsId.length > 0) {
        await this.blogsRepository.updateDestinations(blog.id, destinationsId);
      }
      return blog;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(blogId: number): Promise<Blog> {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) throw new NotFoundException('not-found');

    return blog;
  }

  private async update(model: Blog): Promise<Blog> {
    const blog = await this.blogsRepository.findById(model.id);

    if (!blog) throw new NotFoundException('not-found');

    let destinationsId: number[] = [];

    if (model.destinations) {
      destinationsId = model.destinations.map<number>(destination => {
        if (destination?.id) return destination.id;

        return destination;
      });
      delete model.destinations;
    }

    if (blog.id && destinationsId.length > 0) {
      await this.blogsRepository.updateDestinations(blog.id, destinationsId);
    }

    return this.blogsRepository.update(model);
  }

  public async remove(blogId: number): Promise<void> {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) {
      throw new NotFoundException('not-found');
    }

    return this.blogsRepository.remove(blogId);
  }
}
