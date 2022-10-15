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
  Redirect,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Res,
  UseFilters
} from '@nestjs/common';
import { Request as RequestExpress, Response as ResponseExpress } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiFile } from 'src/modules/common/decorators/ApiFile';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { User } from '../../database/models/users.entity';
import { UserReviewService } from '../services/userReview';
import { UsersService } from '../services/users';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListUsersReview } from '../validators/userReview/get';
import { ListSearchUsers, ListUsers } from '../validators/users/get';
import { ChangePass, UpdateTokenOneSignal, UpdateUser } from '../validators/users/update';
import { Follow } from 'src/modules/database/models/follows.entity';
import { QueryFailFilter } from 'src/modules/common/filters/queryerror.filter';
import { IPaginated } from 'src/modules/common/services/pagination';

@ApiTags('App: Users')
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService, private userReviewService: UserReviewService) {}

  @Post('/follow/:id')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(new QueryFailFilter())
  public async follow(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Follow> {
    const result = await this.usersService.follow(id, req.user);
    return result;
  }

  @Post('/unfollow/:id')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async unfollow(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Follow> {
    const result = await this.usersService.unfollow(id, req.user);
    return result;
  }

  @Get('/followers/:id?')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async followers(
    @Param('id') id: number,
    @Query() params: PaginationQuery,
    @Req() req
  ): Promise<IPaginated<Follow>> {
    const result = await this.usersService.getFollowers(id || req.user.id, req.user, params);
    return result;
  }

  @Get('/following/:id?')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async follows(
    @Param('id') id: number,
    @Query() params: PaginationQuery,
    @Req() req
  ): Promise<IPaginated<Follow>> {
    const result = await this.usersService.getFollows(id || req.user.id, req.user, params);
    return result;
  }

  @Get('/connection-follows/:id')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async followConnections(
    @Param('id', ParseIntPipe) id: number,
    @Query() params: PaginationQuery,
    @Req() req
  ): Promise<IPaginated<Follow>> {
    const result = await this.usersService.followConnections(id, req.user, params);
    return result;
  }

  @Get()
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200, description: 'Listagem de usuários' })
  public async list(@Query() params: ListSearchUsers, @Req() req) {
    return this.usersService.list(params, req.user);
  }

  @Get('/account')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200, type: User, description: 'Retorna os dados do perfil do usuário logado' })
  async getAccountData(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.id, true);
  }

  @Get('interests')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Listagem de usuários ordenados por interesses em comum'
  })
  public async usersByInterests(@Req() req, @Query() params: ListUsers) {
    return this.usersService.usersByInterests(req.user, params);
  }

  @Get('exists/:email')
  @ApiResponse({
    status: 200,
    description: 'Verifica se existe usuário cadastrado por email.'
  })
  public async checkByEmail(@Param('email') email: string) {
    return this.usersService.checkByEmail(email);
  }

  @Get('exists/phoneNumber/:phoneNumber')
  @ApiResponse({
    status: 200,
    description: 'Verifica se existe usuário cadastrado por telefone'
  })
  public async checkByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.usersService.checkByPhoneNumber(phoneNumber);
  }

  @Get(':userId')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200, type: User, description: 'Retorna os dados de perfil do usuário' })
  public async details(@Param('userId', ParseIntPipe) userId: number, @Request() req) {
    return this.usersService.findById(userId, false, req.user);
  }

  @Get(':userId/feeds')
  @ApiResponse({
    status: 200,
    description: 'Retorna as postagens (feed) do usuário'
  })
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async listFeeds(@Param('userId', ParseIntPipe) userId: number, @Query() query: PaginationQuery) {
    return this.usersService.listFeeds(userId, query);
  }

  @Get(':userId/media')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200, type: User, description: 'Retorna todas as mídias publicadas pelo usuário' })
  public async listMedia(@Param('userId', ParseIntPipe) userId: number, @Query() query: PaginationQuery) {
    return this.usersService.listMedia(userId, query);
  }

  @Get(':userId/reviews')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações por usuário'
  })
  public async usersReviews(@Param('userId', ParseIntPipe) userId: number, @Query() params: ListUsersReview) {
    return this.userReviewService.list(params, userId);
  }

  @Put('')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200 })
  @ApiBody({ description: 'Atualizar dados do usuario logado', type: UpdateUser })
  public async uploadProfile(@Body() model: UpdateUser, @Request() req) {
    return this.usersService.updateProfile(model, req.user);
  }

  @Put('/change-password')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 200 })
  @ApiBody({
    type: ChangePass,
    description: 'Alterar senha do usuário logado'
  })
  public async changePass(@Body() model: ChangePass, @Request() req) {
    return this.usersService.changePass(model, req.user);
  }

  @Put('/upload')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiResponse({ status: 200, description: 'Faz o upload da imagem e já atualiza a foto do perfil do usuário logado' })
  public async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.usersService.uploadProfilePhoto(file, req.user);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @ApiResponse({ status: 200, description: 'Salva imagem de perfil no diretório de fotos' })
  public async createProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadProfilePhoto(file);
  }

  @Delete('deleteAccount')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description:
      'Pedido de exclusão de conta do usuário logado, envia um email ao usuário perguntando se o mesmo deseja realmente deletar sua conta'
  })
  public async deleteAccountRequest(@Request() req) {
    return this.usersService.deleteAccountRequest(req.user);
  }

  @Delete('confirmDeletion')
  @ApiResponse({
    status: 200,
    description: 'Deleta todos os dados do usuário'
  })
  public async confirmDeleteAccountRequest(@Query('token') token: string) {
    return this.usersService.deleteAllUserData(token);
  }

  @Post('/refreshTokenOneSignal')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Atualiza o token do usuário para receber notificações do OneSignal'
  })
  public async refreshTokenOneSignal(@Body() model: UpdateTokenOneSignal, @Request() req) {
    return this.usersService.refreshTokenOneSignal(model.tokenOneSignal, req?.user?.id || null);
  }

  @Get('/forgot-password/:token')
  @ApiResponse({
    status: 301,
    description: 'Redireciona para a página de redefinição de senha'
  })
  public async redirectForgotPassword(
    @Param('token') token: string,
    @Req() req: RequestExpress,
    @Res() res: ResponseExpress
  ) {
    const userAgent = req.get('user-agent');

    let isMobile: string | undefined = null;
    if (/android/i.test(userAgent)) {
      isMobile = 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      isMobile = 'iOS';
    }

    if (isMobile) {
      return res.redirect(`/app/users/forgot-mobile/${token}`);
    } else {
      return res.redirect(`/app/users/forgot-web/${token}`);
    }
  }

  @Redirect('pinguim://password-reset/:token')
  @Get('/forgot-mobile/:token')
  public async redirectForgotPassMobile(@Param('token') token: string) {
    const url = `pinguim://password-reset/${token}`;
    console.log('redirect to', url);
    return { url };
  }

  @Redirect('https://pinguim.tur.br/recuperacao-de-senha-nest/?t=:token')
  @Get('/forgot-web/:token')
  public async redirectForgotPassWeb(@Param('token') token: string) {
    const url = `https://pinguim.tur.br/recuperacao-de-senha-nest/?t=${token}`;

    return { url };
  }
}
