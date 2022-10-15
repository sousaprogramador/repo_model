import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { State } from 'src/modules/database/models/states.entity';

import { CreateStates } from '../validators/states/save';
import { StatesRepository } from '../repositories/states';
import { StatesService } from '../services/states';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { ListStates } from '../validators/states/get';

@ApiTags('Admin: States')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/states')
export class StatesController {
  constructor(private statesRepository: StatesRepository, private statesService: StatesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListStates) {
    return this.statesService.list(params);
  }

  @Get(':stateId')
  @ApiResponse({ status: 200, type: State })
  public async details(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.statesService.findById(stateId);
  }

  @Delete(':stateId')
  public async delete(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.statesService.remove(stateId);
  }

  @Post()
  @ApiResponse({ status: 200, type: State })
  public async save(@Body() model: CreateStates) {
    return this.statesService.save(model);
  }

  @Get(':stateId/cities')
  @ApiResponse({ status: 200, type: State })
  public async citiesByState(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.statesService.citiesByState(stateId);
  }
}
