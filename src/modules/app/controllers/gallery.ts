import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Gallery } from 'src/modules/database/models/galleries.entity';
import { GalleryService } from '../services/gallery';
import { GalleryRepository } from '../repositories/gallery';
import { CreateGallery } from '../validators/gallery/save';

@ApiTags('App: galleries')
@Controller('galleries')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
class GalleryController {
  constructor(private galleryService: GalleryService, private galleryRepository: GalleryRepository) {}

  @Get('')
  @ApiResponse({ status: 200, description: 'Listagem de galerias' })
  public async getFeedsOrderingByInterests(@Request() req): Promise<Gallery[]> {
    return this.galleryService.list(req.user);
  }

  @Get(':galeryId')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200, type: Gallery, description: 'Retorna os dados da galerias do usuário' })
  public async findById(@Param('galeryId', ParseIntPipe) galeryId: number) {
    return this.galleryService.findById(galeryId);
  }

  @Post('')
  @ApiResponse({ status: 201, description: 'Cria a galeria do usuário' })
  public async create(@Body() model: CreateGallery, @Request() req): Promise<Gallery> {
    return await this.galleryService.create(model, req.user);
  }

  @Put(':galeryId')
  @ApiResponse({ status: 201, description: 'Edita a galeria do usuário' })
  public async update(
    @Param('galeryId', ParseIntPipe) galeryId: number,
    @Body() model: CreateGallery
  ): Promise<Gallery> {
    return await this.galleryService.update(galeryId, model);
  }

  @Delete(':galeryId')
  @ApiResponse({ status: 200, description: 'Deleta galeria' })
  public async deleteFeed(@Param('galeryId', ParseIntPipe) galeryId: number): Promise<void> {
    return this.galleryService.delete(galeryId);
  }
}

export { GalleryController };
