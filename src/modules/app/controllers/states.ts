import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { State } from 'src/modules/database/models/states.entity';

import { StatesService } from '../services/states';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: States')
@Controller('/states')
export class StatesController {
  constructor(private statesService: StatesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.statesService.list(params);
  }

  @Get(':stateId')
  @ApiResponse({ status: 200, type: State })
  public async details(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.statesService.findById(stateId);
  }

  @Get(':stateId/cities')
  @ApiResponse({ status: 200, type: State })
  public async citiesByState(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.statesService.citiesByState(stateId);
  }
}
