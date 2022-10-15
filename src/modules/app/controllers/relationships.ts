/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RelationshipsService } from '../services/relationships';
import { Relationship } from '../../database/models/relationships.entity';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Relationships')
@Controller('/relationships')
export class RelationshipsController {
  constructor(private relationshipsService: RelationshipsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.relationshipsService.list(params);
  }

  @Get(':preferenceId')
  @ApiResponse({ status: 200, type: Relationship })
  public async details(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.relationshipsService.findById(preferenceId);
  }
}
