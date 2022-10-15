/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDestinationsCategories } from '../validators/destinationsCategories/save';
import { DestinationsCategoriesRepository } from './../repositories/destinationsCategories';
import { DestinationsCategory } from '../../database/models/destinationsCategories.entity';
import { DestinationsCategoriesService } from './../services/destinationsCategories';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListDestinationCategories } from '../validators/destinationsCategories/get';

@ApiTags('Admin: DestinationsCategories')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/destinationsCategories')
export class DestinationsCategoriesController {
  constructor(
    private destinationsCategoriesRepository: DestinationsCategoriesRepository,
    private destinationsCategoriesService: DestinationsCategoriesService
  ) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListDestinationCategories) {
    return this.destinationsCategoriesService.list(params);
  }

  @Post()
  @ApiResponse({ status: 200, type: DestinationsCategory })
  public async save(@Body() model: CreateDestinationsCategories) {
    return this.destinationsCategoriesService.save(model);
  }

  @Get(':destinationsCategoriesId')
  @ApiResponse({ status: 200, type: DestinationsCategory })
  public async details(@Param('destinationsCategoriesId', ParseIntPipe) destinationsCategoriesId: number) {
    return this.destinationsCategoriesService.findById(destinationsCategoriesId);
  }

  @Delete(':destinationsCategoriesId')
  public async delete(@Param('destinationsCategoriesId', ParseIntPipe) destinationsCategoriesId: number) {
    return this.destinationsCategoriesService.remove(destinationsCategoriesId);
  }
}
