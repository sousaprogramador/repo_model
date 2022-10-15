import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Country } from 'src/modules/database/models/countries.entity';
import { State } from 'src/modules/database/models/states.entity';
import { CountriesRepository } from '../repositories/countries';
import { CountriesService } from '../services/countries';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Countries')
@Controller('/countries')
export class CountriesController {
  constructor(private countriesRepository: CountriesRepository, private countriesService: CountriesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.countriesService.findAll(params);
  }

  @Get(':countryId')
  @ApiResponse({ status: 200, type: Country })
  public async details(@Param('countryId', ParseIntPipe) countryId: number) {
    return this.countriesService.findById(countryId);
  }

  @Get(':countryId/states')
  @ApiResponse({ status: 200, type: State })
  public async statesByCountry(@Param('countryId', ParseIntPipe) countryId: number) {
    return this.countriesService.statesByCountry(countryId);
  }
}
