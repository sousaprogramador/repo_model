/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InterestsService } from './../services/interests';
import { Interest } from './../../database/models/interests.entity';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Interests')
@Controller('/interests')
export class InterestsController {
  constructor(private interestsService: InterestsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.interestsService.list(params);
  }

  @Get(':interestsId')
  @ApiResponse({ status: 200, type: Interest })
  public async details(@Param('interestsId', ParseIntPipe) interestsId: number) {
    return this.interestsService.findById(interestsId);
  }
}
