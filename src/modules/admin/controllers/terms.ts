/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TermsRepository } from '../repositories/terms';
import { TermsService } from '../services/terms';
import { Term } from '../../database/models/terms.entity';
import { CreateTerms } from '../validators/terms/save';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { ListTerms } from '../validators/terms/get';

@ApiTags('Admin: Terms')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/terms')
export class TermsController {
  constructor(private termsService: TermsService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListTerms) {
    return this.termsService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: Term })
  public async save(@Body() model: CreateTerms) {
    return this.termsService.save(model);
  }

  @Get(':termId')
  @ApiResponse({ status: 200, type: Term })
  public async details(@Param('termId', ParseIntPipe) termId: number) {
    return this.termsService.findById(termId);
  }

  @Delete(':termId')
  public async delete(@Param('termId', ParseIntPipe) termId: number) {
    return this.termsService.remove(termId);
  }
}
