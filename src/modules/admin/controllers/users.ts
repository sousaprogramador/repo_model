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

import { UsersRepository } from '../repositories/users';
import { UsersService } from '../services/users';
import { User } from '../../database/models/users.entity';
import { CreateUsers } from '../validators/users/save';
import { ChangePass, UploadProfilePhoto } from '../validators/users/update';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListUsers } from '../validators/users/get';

@ApiTags('Admin: Users')
@Roles('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListUsers) {
    return this.usersService.list(params);
  }

  @Post()
  @ApiResponse({ status: 201, type: User })
  public async save(@Body() model: CreateUsers) {
    return this.usersService.save(model);
  }

  @Get('/account')
  @ApiResponse({ status: 200, type: User })
  async getAccountData(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.id);
  }

  @Put('/change-password')
  @ApiResponse({ status: 200 })
  public async changePass(@Body() model: ChangePass, @Request() req) {
    return this.usersService.changePass(model, req.user);
  }

  @Get(':userId')
  @ApiResponse({ status: 200, type: User })
  public async details(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findById(userId);
  }

  @Delete(':userId')
  @ApiResponse({ status: 200 })
  public async delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.remove(userId);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UploadProfilePhoto })
  @ApiResponse({ status: 200 })
  public async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @Body('userId') userId?: number) {
    return this.usersService.uploadProfilePhoto(file, userId);
  }
}
