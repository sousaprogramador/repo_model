/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartnersRepository } from '../repositories/partners';
import { PartnersService } from '../services/partners';
import { Partner } from '../../database/models/partners.entity';
import { CreatePartners } from '../validators/partners/save';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { ListPartners } from '../validators/partners/get';

@ApiTags('Admin: Partners')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/partners')
export class PartnersController {
  constructor(private partnersRepository: PartnersRepository, private partnersService: PartnersService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListPartners) {
    return this.partnersService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: Partner })
  public async save(@Body() model: CreatePartners) {
    return this.partnersService.save(model);
  }

  @Get(':partnerId')
  @ApiResponse({ status: 200, type: Partner })
  public async details(@Param('partnerId', ParseIntPipe) partnerId: number) {
    return this.partnersService.findById(partnerId);
  }

  @Delete(':partnerId')
  public async delete(@Param('partnerId', ParseIntPipe) partnerId: number) {
    return this.partnersService.remove(partnerId);
  }
}
