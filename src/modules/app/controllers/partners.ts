/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartnersService } from '../services/partners';
import { Partner } from '../../database/models/partners.entity';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Partners')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.partnersService.list(params);
  }

  @Get(':partnerId')
  @ApiResponse({ status: 200, type: Partner })
  public async details(@Param('partnerId', ParseIntPipe) partnerId: number) {
    return this.partnersService.findById(partnerId);
  }
}
