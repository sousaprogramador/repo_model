import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateCities } from '../validators/cities/save';
import { CitiesRepository } from '../repositories/cities';
import { CitiesService } from '../services/cities';

import { City } from 'src/modules/database/models/cities.entity';

import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ListCities } from '../validators/cities/get';

@ApiTags('Admin: Cities')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/cities')
export class CitiesController {
  constructor(private citiesRepository: CitiesRepository, private citiesService: CitiesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListCities) {
    return this.citiesService.list(params);
  }

  @Get('search/:cityName')
  @ApiResponse({ status: 200, type: City })
  public async cityByName(@Param('cityName') cityName: string) {
    return this.citiesService.findByName(cityName);
  }

  @Get(':cityId')
  @ApiResponse({ status: 200, type: City })
  public async details(@Param('cityId', ParseIntPipe) cityId: number) {
    return this.citiesService.findById(cityId);
  }

  @Delete(':cityId')
  public async delete(@Param('cityId', ParseIntPipe) cityId: number) {
    return this.citiesRepository.remove(cityId);
  }

  @Post()
  @ApiResponse({ status: 200, type: City })
  public async save(@Body() model: CreateCities) {
    return this.citiesService.save(model);
  }
}
