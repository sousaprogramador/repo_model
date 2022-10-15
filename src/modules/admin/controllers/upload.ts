/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';

import { ApiFile } from 'src/modules/common/decorators/ApiFile';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload';
@ApiTags('Admin: Upload')
@Controller('/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('post')
  @ApiFile('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadPost(file);
  }

  @Post('svg')
  @Roles('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiFile('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadSvg(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadSvg(file);
  }
}
