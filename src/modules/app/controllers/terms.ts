/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TermsService } from '../services/terms';
import { Term } from '../../database/models/terms.entity';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListTerms } from '../validators/terms/get';
import { Req } from '@nestjs/common';

@ApiTags('App: Terms')
@Controller('/terms')
export class TermsController {
  constructor(private termsService: TermsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListTerms) {
    return this.termsService.list(params);
  }

  @Get(':termId')
  @ApiResponse({ status: 200, type: Term })
  public async details(@Param('termId', ParseIntPipe) termId: number) {
    return this.termsService.findById(termId);
  }
}
