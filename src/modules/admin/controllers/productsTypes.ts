/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductType } from '../../database/models/productsTypes.entity';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { ProductsTypesService } from '../services/productsTypes';
import { ListProductsTypes } from '../validators/productsTypes/get';
import { CreateProductType } from '../validators/productsTypes/save';

@ApiTags('Admin: Products Types')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/productsTypes')
export class ProductsTypesController {
  constructor(private offersCategoriesGroupsService: ProductsTypesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListProductsTypes) {
    return this.offersCategoriesGroupsService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: ProductType })
  public async save(@Body() model: CreateProductType) {
    return this.offersCategoriesGroupsService.save(model);
  }

  @Get(':groupId')
  @ApiResponse({ status: 200, type: ProductType })
  public async details(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.offersCategoriesGroupsService.findById(groupId);
  }

  @Delete(':groupId')
  public async delete(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.offersCategoriesGroupsService.remove(groupId);
  }
}
