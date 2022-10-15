/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OffersCategory } from '../../database/models/offersCategories.entity';
import { OffersCategoriesService } from '../services/offersCategories';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ListOfferCategories } from '../validators/offersCategories/get';

@ApiTags('App: Offer Categories')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/offersCategories')
export class OffersCategoriesController {
  constructor(private offersCategoriesService: OffersCategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem de categoria de ofertas' })
  public async list(@Query() params: ListOfferCategories) {
    return this.offersCategoriesService.list(params);
  }

  @Get(':offerCategoryId')
  @ApiResponse({ status: 200, type: OffersCategory, description: 'Detalha uma categoria de oferta' })
  public async details(@Param('offerCategoryId', ParseIntPipe) offerCategoryId: number) {
    return this.offersCategoriesService.findById(offerCategoryId);
  }
}
