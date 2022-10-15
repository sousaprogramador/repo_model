import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PreferencesService } from '../services/preferences';
import { Preference } from '../../database/models/preferences.entity';
import { PaginationQuery } from '../validators/common/paginationQuery';

@ApiTags('App: Preferences')
@Controller('/preferences')
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: PaginationQuery) {
    return this.preferencesService.list(params);
  }

  @Get(':preferenceId')
  @ApiResponse({ status: 200, type: Preference })
  public async details(@Param('preferenceId', ParseIntPipe) preferenceId: number) {
    return this.preferencesService.findById(preferenceId);
  }
}
