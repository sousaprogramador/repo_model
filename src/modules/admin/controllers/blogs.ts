/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogsRepository } from '../repositories/blogs';
import { BlogsService } from '../services/blogs';
import { Blog } from '../../database/models/blogs.entity';
import { CreateBlogs } from '../validators/blogs/save';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListBlogs } from '../validators/blogs/get';

@ApiTags('Admin: Blogs')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/blogs')
export class BlogsController {
  constructor(private blogsRepository: BlogsRepository, private blogsService: BlogsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListBlogs) {
    return this.blogsService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: Blog })
  public async save(@Body() model: CreateBlogs) {
    return this.blogsService.save(model);
  }

  @Get(':blogId')
  @ApiResponse({ status: 200, type: Blog })
  public async details(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.blogsService.findById(blogId);
  }

  @Delete(':blogId')
  public async delete(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.blogsService.remove(blogId);
  }
}
