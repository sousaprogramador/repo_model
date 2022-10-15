import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiMultiFile } from '../decorators/ApiMultiFile';
import { JwtAuthGuard } from '../jwt.guard';
import { RolesGuard } from '../role.guard';
import { Roles } from '../roles.decorator';
import { AwsService } from '../services/aws';

@ApiTags('AWS ')
@Controller('upload')
export class AwsController {
  constructor(private awsService: AwsService) {}

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.awsService.uploadImages(files);
  }
}
