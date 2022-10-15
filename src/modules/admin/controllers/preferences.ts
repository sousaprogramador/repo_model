/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PreferencesRepository } from '../repositories/preferences';
import { PreferencesService } from '../services/preferences';
import { Preference } from '../../database/models/preferences.entity';
import { CreatePreferences } from '../validators/preferences/save';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { ListPreferences } from '../validators/preferences/get';

@ApiTags('Admin: Preferences')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/preferences')
export class PreferencesController {
  constructor(private preferencesRepository: PreferencesRepository, private preferencesService: PreferencesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListPreferences) {
    return this.preferencesService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: Preference })
  public async save(@Body() model: CreatePreferences) {
    return this.preferencesService.save(model);
  }

  @Get(':preferenceId')
  @ApiResponse({ status: 200, type: Preference })
  public async details(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.preferencesService.findById(preferenceId);
  }

  @Delete(':preferenceId')
  public async delete(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.preferencesService.remove(preferenceId);
  }
}
