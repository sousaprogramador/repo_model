import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AdjectivesService } from 'src/modules/admin/services/adjectives';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Adjective } from 'src/modules/database/models/adjectives.entity';
import { Avaliation } from 'src/modules/database/models/avaliations.entity';
import { AvaliationsService } from '../services/avaliations';
import { CreateAvaliation } from '../validators/avaliations/create';

@ApiTags('App: Avaliations')
@Controller('/avaliations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
class AvaliationsController {
  constructor(private avaliationsService: AvaliationsService, private adjectivesService: AdjectivesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Avaliation,
    description: 'Avaliar outro usuário'
  })
  public async create(@Body() data: CreateAvaliation, @Request() req): Promise<Avaliation> {
    const result = await this.avaliationsService.create(data, req.user);
    return result;
  }

  @Get('/adjectives')
  public async listAdjectives(@Query('rating') rating: number): Promise<Adjective[]> {
    const result = await this.adjectivesService.list(rating);
    return result;
  }

  @Get('/user/:id')
  @ApiResponse({ status: 200, type: Pagination<Avaliation> })
  public async userAvaliations(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC'
  ): Promise<Pagination<Avaliation>> {
    const result = await this.avaliationsService.list(id, { limit, page }, order);
    return result;
  }

  @Get('/user/:id/resume')
  public async userData(@Param('id', ParseIntPipe) id: number) {
    const result = await this.avaliationsService.getResume(id);
    return result;
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Avaliation })
  public async read(@Param() id: number): Promise<Avaliation> {
    const result = await this.avaliationsService.read(id);
    return result;
  }

  @Get('')
  public async list(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC'
  ): Promise<Pagination<Avaliation>> {
    const result = await this.avaliationsService.list(req.user, { limit, page }, order);
    return result;
  }
}

export { AvaliationsController };
