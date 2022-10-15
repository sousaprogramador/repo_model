import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { ApiFile } from 'src/modules/common/decorators/ApiFile';
import { UsersImages } from 'src/modules/database/models/usersImages.entity';
import { UsersImagesRepository } from '../repositories/usersImages';
import { UsersImagesService } from '../services/usersImages';
import { CreateUsersImages } from '../validators/usersImages/save';

@ApiTags('App: usersImages')
@Controller('usersImages')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
class UsersImagesController {
  constructor(private usersImagesService: UsersImagesService, private usersImagesRepository: UsersImagesRepository) {}

  @Get('')
  @ApiResponse({ status: 200, description: 'Listagem de galerias' })
  public async getFeedsOrderingByInterests(@Request() req): Promise<any> {
    return this.usersImagesService.list(req.user);
  }

  @Get(':userImagesId')
  @Roles('user')
  @ApiBearerAuth()
  @ApiFile()
  @ApiResponse({ status: 200, type: UsersImages, description: 'Retorna os dados da galerias do usuário' })
  public async findById(@Param('userImagesId', ParseIntPipe) userImagesId: number) {
    return this.usersImagesService.findById(userImagesId);
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Cria a galeria do usuário' })
  public async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() model: CreateUsersImages,
    @Request() req
  ): Promise<UsersImages> {
    return await this.usersImagesService.create(file, model, req.user);
  }

  @Delete(':userImagesId')
  @ApiResponse({ status: 200, description: 'Deleta galeria' })
  public async deleteFeed(@Param('userImagesId', ParseIntPipe) userImagesId: number): Promise<void> {
    return this.usersImagesService.delete(userImagesId);
  }
}

export { UsersImagesController };
