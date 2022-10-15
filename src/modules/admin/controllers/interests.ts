/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InterestsRepository } from './../repositories/interests';
import { InterestsService } from './../services/interests';
import { Interest } from './../../database/models/interests.entity';
import { CreateInterests } from './../validators/interests/save';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListInterests } from '../validators/interests/get';

@ApiTags('Admin: Interests')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/interests')
export class InterestsController {
  constructor(private interestsRepository: InterestsRepository, private interestsService: InterestsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListInterests) {
    return this.interestsService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: Interest })
  public async save(@Body() model: CreateInterests) {
    return this.interestsService.save(model);
  }

  @Get(':interestsId')
  @ApiResponse({ status: 200, type: Interest })
  public async details(@Param('interestsId', ParseIntPipe) interestsId: number) {
    return this.interestsService.findById(interestsId);
  }

  @Delete(':interestsId')
  public async delete(@Param('interestsId', ParseIntPipe) interestsId: number) {
    return this.interestsService.remove(interestsId);
  }
}
