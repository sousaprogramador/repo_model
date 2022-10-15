import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DestinationService } from '../services/destinations';

import { Destination } from 'src/modules/database/models/destinations.entity';

import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ListDestination } from '../validators/destinations/get';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Destinations')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/destinations')
export class DestinationsController {
  constructor(private destinationsService: DestinationService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem de destinos' })
  public async list(@Query() params: ListDestination, @Req() req) {
    return this.destinationsService.list(params, req.user);
  }

  @Get('interests')
  @ApiResponse({ status: 200, description: 'Lista/ordena destinos baseando-se nos interesses do usuário logado' })
  public async listByInterests(@Query() params: ListDestination, @Req() req) {
    return this.destinationsService.listByInterests(params, req.user);
  }

  @Get(':destinationId')
  @ApiResponse({ status: 200, type: Destination })
  public async details(@Param('destinationId', ParseIntPipe) destinationId: number, @Req() req) {
    return this.destinationsService.findById(destinationId, req.user);
  }

  @Get(':destinationId/offers')
  @ApiResponse({ status: 200, type: Destination, description: 'Retorna ofertas relacionadas a um destino especifico' })
  public async offers(
    @Param('destinationId', ParseIntPipe) destinationId: number,
    @Query() query: PaginationQuery,
    @Req() req
  ) {
    return this.destinationsService.findOffers(destinationId, query, req.user);
  }

  @Get(':destinationId/reviews')
  @ApiResponse({ status: 200, type: Destination, description: 'Retorna reviews de um destino' })
  public async reviews(
    @Param('destinationId', ParseIntPipe) destinationId: number,
    @Req() req,
    @Query() query: PaginationQuery
  ) {
    return this.destinationsService.findReviews(destinationId, req.user, query);
  }
}
