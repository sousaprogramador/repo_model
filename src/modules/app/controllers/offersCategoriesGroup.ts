/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OffersCategoriesGroups } from '../../database/models/offersCategoriesGroups.entity';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { OffersCategoriesGroupsService } from '../services/offersCategoriesGroup';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Offer Categories Group')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/offersCategoriesGroup')
export class OffersCategoriesGroupsController {
  constructor(private offersCategoriesGroupsService: OffersCategoriesGroupsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem e Grupos de categoria de ofertas' })
  public async list(@Query() params: PaginationQuery) {
    return this.offersCategoriesGroupsService.list(params);
  }

  @Get(':groupId')
  @ApiResponse({
    status: 200,
    type: OffersCategoriesGroups,
    description: 'Detalha os dados de uma categoria de ofertas'
  })
  public async details(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.offersCategoriesGroupsService.findById(groupId);
  }
}
