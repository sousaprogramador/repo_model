import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Blog } from 'src/modules/database/models/blogs.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BlogsRepository } from '../repositories/blogs';
import { PaginationQuery } from '../validators/common/paginationQuery';

@Injectable()
export class BlogsService {
  logger: Logger;
  constructor(private blogsRepository: BlogsRepository) {
    this.logger = new Logger();
  }

  public async list(params: PaginationQuery) {
    try {
      const { page, limit } = params;
      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      return this.blogsRepository.list(paginationOption);
    } catch (e) {
      this.logger.error('error list BlogService', e);
      throw new InternalServerErrorException('error-list-blogs');
    }
  }

  public async findById(blogId: number): Promise<Blog> {
    try {
      const blog = await this.blogsRepository.findById(blogId);

      if (!blog) throw new NotFoundException('not-found');

      return blog;
    } catch (e) {
      this.logger.error('error findById BlogService', e);
      throw new InternalServerErrorException('error-find-blog');
    }
  }
}
