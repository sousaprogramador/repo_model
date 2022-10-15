import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { UsersTrips } from 'src/modules/database/models/usersTrips.entity';
import { UsersTripsService } from '../services/usersTrips';
import { CreateUsersTrips } from '../validators/usersTrips/save';

@ApiTags('App: usersTrips')
@Controller('usersTrips')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
class UsersTripsController {
  constructor(private usersTripsService: UsersTripsService) {}

  @Get('')
  @ApiResponse({ status: 200, description: 'Listagem de galerias' })
  public async getFeedsOrderingByInterests(@Request() req): Promise<any> {
    return this.usersTripsService.list(req.user);
  }

  @Get(':userTripsId')
  @Roles('user')
  @ApiBearerAuth()
  @ApiFile()
  @ApiResponse({ status: 200, type: UsersTrips, description: 'Retorna os dados da galerias do usuário' })
  public async findById(@Param('userTripsId', ParseIntPipe) userTripsId: number) {
    return this.usersTripsService.findById(userTripsId);
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Cria a galeria do usuário' })
  public async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() model: CreateUsersTrips,
    @Request() req
  ): Promise<UsersTrips> {
    return await this.usersTripsService.create(file, model, req.user);
  }

  @Delete(':userTripsId')
  @ApiResponse({ status: 200, description: 'Deleta galeria' })
  public async deleteFeed(@Param('userTripsId', ParseIntPipe) userTripsId: number): Promise<void> {
    return this.usersTripsService.delete(userTripsId);
  }
}

export { UsersTripsController };
