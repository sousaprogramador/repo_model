import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OffersService } from '../services/offers';

import { Offer } from 'src/modules/database/models/offers.entity';

import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ListOffer, ListOfferCustom } from '../validators/offers/get';

@ApiTags('App: Offers')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem de ofertas' })
  public async list(@Query() params: ListOfferCustom, @Req() req) {
    return this.offersService.list(params, req.user);
  }

  @Get('interests')
  @ApiResponse({ status: 200, description: 'Listagem de ofertas ordenadas por interesse do usuário logado' })
  public async listByInterests(@Query() params: ListOffer, @Req() req) {
    return this.offersService.listByInterests(params, req.user);
  }

  @Get(':offerId')
  @ApiResponse({ status: 200, type: Offer, description: 'Detalhes de uma oferta' })
  public async details(@Param('offerId', ParseIntPipe) offerId: number, @Req() req) {
    return this.offersService.findById(offerId, req.user);
  }
}
