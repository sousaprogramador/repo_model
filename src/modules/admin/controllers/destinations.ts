import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateDestination } from '../validators/destinations/save';
import { DestinationRepository } from '../repositories/destinations';
import { DestinationService } from '../services/destinations';

import { Destination } from 'src/modules/database/models/destinations.entity';

import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ListDestination } from '../validators/destinations/get';

@ApiTags('Admin: Destinations')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/destinations')
export class DestinationsController {
  constructor(private destinationsRepository: DestinationRepository, private destinationsService: DestinationService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListDestination) {
    return this.destinationsService.list(params);
  }

  @Get(':destinationId')
  @ApiResponse({ status: 200, type: Destination })
  public async details(@Param('destinationId', ParseIntPipe) destinationId: number) {
    return this.destinationsService.findById(destinationId);
  }

  @Delete(':destinationId')
  public async delete(@Param('destinationId', ParseIntPipe) destinationId: number) {
    return this.destinationsRepository.remove(destinationId);
  }

  @Post()
  @ApiResponse({ status: 201, type: Destination })
  public async save(@Body() model: CreateDestination) {
    return this.destinationsService.save(model);
  }
}
