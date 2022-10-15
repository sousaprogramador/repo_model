import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/modules/common/decorators/ApiFile';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { OffersCategory } from '../../database/models/offersCategories.entity';
import { OffersCategoriesService } from '../services/offersCategories';
import { ListOfferCategories } from '../validators/offersCategories/get';
import { CreateOffersCategories } from '../validators/offersCategories/save';

@ApiTags('Admin: Offer Categories')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/offersCategories')
export class OffersCategoriesController {
  constructor(private offersCategoriesService: OffersCategoriesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiBody({ type: CreateOffersCategories })
  @ApiResponse({ status: 201, type: OffersCategory })
  public async save(@Body() model: CreateOffersCategories, @UploadedFile() file: Express.Multer.File) {
    const result = await this.offersCategoriesService.save(model, file);
    return result;
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiBody({ type: CreateOffersCategories })
  public async update(
    @Param() { id },
    @Body() model: CreateOffersCategories,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<OffersCategory> {
    model.id = id;

    const result = await this.offersCategoriesService.save(model, file);
    return result;
  }

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListOfferCategories) {
    return this.offersCategoriesService.list(params);
  }

  @Get(':offerCategoryId')
  @ApiResponse({ status: 200, type: OffersCategory })
  public async details(@Param('offerCategoryId', ParseIntPipe) offerCategoryId: number) {
    return this.offersCategoriesService.findById(offerCategoryId);
  }

  @Delete(':offerCategoryId')
  public async delete(@Param('offerCategoryId', ParseIntPipe) offerCategoryId: number) {
    return this.offersCategoriesService.remove(offerCategoryId);
  }
}
