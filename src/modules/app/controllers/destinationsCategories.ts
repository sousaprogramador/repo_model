import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DestinationsCategory } from '../../database/models/destinationsCategories.entity';
import { DestinationsCategoriesService } from './../services/destinationsCategories';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: DestinationsCategories')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/destinationsCategories')
export class DestinationsCategoriesController {
  constructor(private destinationsCategoriesService: DestinationsCategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem de categorias de destinos' })
  public async list(@Query() params: PaginationQuery) {
    return this.destinationsCategoriesService.list(params);
  }

  @Get(':destinationsCategoriesId')
  @ApiResponse({ status: 200, type: DestinationsCategory, description: 'Detalhes de uma categoria de oferta' })
  public async details(@Param('destinationsCategoriesId', ParseIntPipe) destinationsCategoriesId: number) {
    return this.destinationsCategoriesService.findById(destinationsCategoriesId);
  }
}
