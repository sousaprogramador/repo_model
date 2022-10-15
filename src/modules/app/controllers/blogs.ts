/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../services/blogs';
import { Blog } from '../../database/models/blogs.entity';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Blogs')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.blogsService.list(params);
  }

  @Get(':blogId')
  @ApiResponse({ status: 200, type: Blog })
  public async details(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.blogsService.findById(blogId);
  }
}
