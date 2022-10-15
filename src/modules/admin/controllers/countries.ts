import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesRepository } from '../repositories/countries';
import { CreateCountries } from '../validators/countries/save';
import { CountriesService } from '../services/countries';

import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Country } from 'src/modules/database/models/countries.entity';
import { State } from 'src/modules/database/models/states.entity';
import { ListCountries } from '../validators/countries/get';

@ApiTags('Admin: Countries')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/countries')
export class CountriesController {
  constructor(private countriesRepository: CountriesRepository, private countriesService: CountriesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListCountries) {
    return this.countriesService.findAll(params);
  }

  @Get(':countryId')
  @ApiResponse({ status: 200, type: Country })
  public async details(@Param('countryId', ParseIntPipe) countryId: number) {
    return this.countriesService.findById(countryId);
  }

  @Delete(':countryId')
  public async delete(@Param('countryId', ParseIntPipe) countryId: number) {
    return this.countriesService.remove(countryId);
  }

  @Post()
  @ApiResponse({ status: 200, type: Country })
  public async save(@Body() model: CreateCountries) {
    return this.countriesService.save(model);
  }

  @Get(':countryId/states')
  @ApiResponse({ status: 200, type: State })
  public async statesByCountry(@Param('countryId', ParseIntPipe) countryId: number) {
    return this.countriesService.statesByCountry(countryId);
  }
}
