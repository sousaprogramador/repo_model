import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateOffers } from '../validators/offers/save';
import { OffersRepository } from '../repositories/offers';
import { OffersService } from '../services/offers';

import { Offer } from 'src/modules/database/models/offers.entity';

import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ListOffers } from '../validators/offers/get';

@ApiTags('Admin: Offers')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/offers')
export class OffersController {
  constructor(private offersRepository: OffersRepository, private offersService: OffersService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListOffers) {
    return this.offersService.list(params);
  }

  @Get(':offerId')
  @ApiResponse({ status: 200, type: Offer })
  public async details(@Param('offerId', ParseIntPipe) offerId: number) {
    return this.offersService.findById(offerId);
  }

  @Post()
  @ApiResponse({ status: 201, type: Offer })
  public async save(@Body() model: CreateOffers) {
    return this.offersService.save(model);
  }

  @Delete(':offerId')
  public async delete(@Param('offerId', ParseIntPipe) offerId: number) {
    return this.offersRepository.remove(offerId);
  }
}
