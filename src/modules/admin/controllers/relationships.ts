/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RelationshipsRepository } from '../repositories/relationships';
import { RelationshipsService } from '../services/relationships';
import { Relationship } from '../../database/models/relationships.entity';
import { CreateRelationships } from '../validators/relationships/save';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { ListRelationships } from '../validators/relationships/get';

@ApiTags('Admin: Relationships')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/relationships')
export class RelationshipsController {
  constructor(
    private relationshipsRepository: RelationshipsRepository,
    private relationshipsService: RelationshipsService
  ) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListRelationships) {
    return this.relationshipsService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: Relationship })
  public async save(@Body() model: CreateRelationships) {
    return this.relationshipsService.save(model);
  }

  @Get(':preferenceId')
  @ApiResponse({ status: 200, type: Relationship })
  public async details(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.relationshipsService.findById(preferenceId);
  }

  @Delete(':preferenceId')
  public async delete(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.relationshipsService.remove(preferenceId);
  }
}
