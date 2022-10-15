/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/common/roles.decorator';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';

import { User } from '../../database/models/users.entity';
import { CreateWishlist } from '../validators/wishlist/save';
import { WishlistService } from '../services/wishlists';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ListUsers } from '../validators/users/get';
import { GetWishlist } from '../validators/wishlist/get';

@ApiTags('App: Wishlist')
@Controller('wishlist')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get('')
  @ApiResponse({ status: 200, description: 'Retorna todos os destinos/ofertas da lista de desejos do usuário logado' })
  public async myWishlists(@Req() req, @Query() params: GetWishlist) {
    return this.wishlistService.wishlists(req.user.id, params);
  }

  @Get('users')
  @ApiResponse({ status: 200, description: 'Retorna usuários com mesmos DESTINOS na lista de desejos' })
  public async myWishlist(@Req() req, @Query() params: ListUsers): Promise<Pagination<User>> {
    return this.wishlistService.getUsers(req.user.id, params);
  }

  @Get(':userId')
  @ApiResponse({ status: 200, description: 'Retorna todos os destinos/ofertas da lista de desejos por id de usuário' })
  public async wishlistsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() params: GetWishlist,
    @Request() req
  ) {
    return this.wishlistService.wishlists(userId, params, req.user.id);
  }

  @Post('toggle')
  @ApiBody({ type: CreateWishlist, description: 'Dados do novo item da lista de desejos' })
  @ApiResponse({ status: 200, description: 'Adiciona ou remove (toggle) um destino da lista de desejos' })
  public async toggleWishlist(@Body() model: CreateWishlist, @Request() req) {
    return this.wishlistService.toggleWishlist(model, req.user);
  }
}
