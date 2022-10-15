import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { Adjective } from 'src/modules/database/models/adjectives.entity';
import { AdjectivesRepository } from '../repositories/adjectives';
import { AdjectivesService } from '../services/adjectives';
import { CreateAdjective } from '../validators/adjectives/create';
import { UpdateAdjective } from '../validators/adjectives/update';

@ApiTags('Admin: Adjectives')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/adjectives')
export class AdjectivesController {
  constructor(private adjectivesService: AdjectivesService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateAdjective })
  public async create(@Body() data: CreateAdjective, @UploadedFile() file: Express.Multer.File): Promise<Adjective> {
    const result = await this.adjectivesService.create(data, file);
    return result;
  }

  @Get(':id')
  public async read(@Param('id', ParseIntPipe) id: number): Promise<Adjective> {
    const result = await this.adjectivesService.read(id);
    return result;
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UpdateAdjective })
  public async update(
    @Param() { id },
    @Body() data: UpdateAdjective,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Adjective> {
    data.id = id;

    const result = await this.adjectivesService.update(data, file);
    return result;
  }

  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<Adjective> {
    const result = await this.adjectivesService.delete(id);
    return result;
  }
}
