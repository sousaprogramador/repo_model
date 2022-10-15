import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CitiesRepository } from '../repositories/cities';
import { CitiesService } from '../services/cities';

import { City } from 'src/modules/database/models/cities.entity';

import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Cities')
@Controller('/cities')
export class CitiesController {
  constructor(private citiesRepository: CitiesRepository, private citiesService: CitiesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.citiesService.list(params);
  }

  @Get(':cityId')
  @ApiResponse({ status: 200, type: City })
  public async details(@Param('cityId', ParseIntPipe) cityId: number) {
    return this.citiesService.findById(cityId);
  }
}
