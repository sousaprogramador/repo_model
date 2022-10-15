import { Injectable } from '@nestjs/common';
import { Blog } from 'src/modules/database/models/blogs.entity';
import { BlogHasDestinations } from 'src/modules/database/models/blogHasDestinations.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindManyOptions, getRepository } from 'typeorm';

@Injectable()
export class BlogsRepository {
  public async listAll(options: FindManyOptions<Blog>): Promise<Blog[]> {
    return Blog.find(options);
  }

  public async list(paginationOptions: IPaginationOptions, options: FindManyOptions<Blog>): Promise<Pagination<Blog>> {
    return paginate<Blog>(
      getRepository(Blog),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      options
    );
  }

  async findById(id: number): Promise<Blog> {
    return Blog.findOne(id, {
      relations: ['destinations']
    });
  }

  async insert(model: Blog): Promise<Blog> {
    return Blog.save(model);
  }

  async update(model: Blog): Promise<Blog> {
    return Blog.save(model);
  }

  async remove(id: number): Promise<void> {
    await Blog.delete(id);
  }

  public async updateDestinations(blogId: number, destinationsId: number[]): Promise<void> {
    await BlogHasDestinations.delete({ blogId });

    destinationsId.map(async destinationId => {
      await BlogHasDestinations.insert({
        blogId,
        destinationId
      });
    });
  }
}
