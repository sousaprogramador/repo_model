/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OffersCategoriesGroups } from '../../database/models/offersCategoriesGroups.entity';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { OffersCategoriesGroupsService } from '../services/offersCategoriesGroup';
import { ListOfferGroupCategories } from '../validators/offersCategoriesGroup/get';
import { CreateOffersGroupsCategories } from '../validators/offersCategoriesGroup/save';

@ApiTags('Admin: Offer Categories Group')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/offersCategoriesGroup')
export class OffersCategoriesGroupsController {
  constructor(private offersCategoriesGroupsService: OffersCategoriesGroupsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListOfferGroupCategories) {
    return this.offersCategoriesGroupsService.list(params);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, type: OffersCategoriesGroups })
  public async save(@Body() data: CreateOffersGroupsCategories, @UploadedFile() file: Express.Multer.File) {
    return this.offersCategoriesGroupsService.save(data, file);
  }

  @Get(':groupId')
  @ApiResponse({ status: 200, type: OffersCategoriesGroups })
  public async details(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.offersCategoriesGroupsService.findById(groupId);
  }

  @Delete(':groupId')
  public async delete(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.offersCategoriesGroupsService.remove(groupId);
  }
}
