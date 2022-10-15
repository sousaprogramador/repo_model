/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { DashboardService } from '../services/dashboard';
import { DashboardPaginationQuery } from '../validators/dashboard/get';

@ApiTags('App: Dashboard')
@Controller('dashboard')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description:
      'Retorna as listagens da tela principal do app. Categoria de Ofertas, Ofertas, Destinos e Usuários ordenados por Interesse'
  })
  async getHome(@Query() query: DashboardPaginationQuery, @Req() req) {
    return this.dashboardService.getHomeData(query, req.user);
  }
}
