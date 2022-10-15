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
  Req,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {} from 'multer';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { FeedComment } from 'src/modules/database/models/feedComments.entity';
import { FeedCommentService } from '../services/feedComments';
import { FeedService } from '../services/feeds';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListFeeds } from '../validators/feed/get';
import { CreateFeed, CreateLike } from '../validators/feed/save';
import { CreateComment, UpdateComment } from '../validators/feed/saveComment';
import { ApiFile } from 'src/modules/common/decorators/ApiFile';

@ApiTags('App: Feed')
@Controller('feeds')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedController {
  constructor(private feedService: FeedService, private feedCommentService: FeedCommentService) {}

  @Get('')
  @ApiResponse({ status: 200, description: 'Listagem de feeds e ordenando por interesses' })
  public async getFeedsOrderingByInterests(@Query() params: ListFeeds, @Req() req): Promise<any> {
    return this.feedService.list(params, req.user);
  }

  @Get(':feedId')
  @ApiResponse({ status: 200, description: 'Listagem de feeds' })
  public async getFeedById(@Param('feedId', ParseIntPipe) feedId: number, @Req() req): Promise<any> {
    return this.feedService.getFeed(feedId, req.user);
  }

  @Get(':feedId/comments')
  @ApiResponse({ status: 200, description: 'Listagem de feeds' })
  public async getFeedComments(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Query() params: PaginationQuery
  ): Promise<any> {
    return this.feedService.getFeedComments(feedId, params);
  }

  @Post('')
  @ApiResponse({ status: 201, description: 'Cria a postagem do usuário' })
  public async createFeed(@Body() model: CreateFeed, @Request() req): Promise<any> {
    return await this.feedService.createFeed(model, req.user);
  }

  @Post('comments')
  @ApiResponse({ status: 201, description: 'Cria comentário para uma postagem' })
  public async createComment(@Body() model: CreateComment, @Request() req) {
    return await this.feedCommentService.createComment(model, req.user);
  }

  @Put(':feedId')
  @ApiResponse({ status: 201, description: 'Atualiza postagem no feed' })
  public async updateFeed(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Body() model: CreateFeed,
    @Req() req
  ): Promise<any> {
    return this.feedService.updateFeed(feedId, model, req.user);
  }

  @Put('comments/:commentId')
  @ApiResponse({ status: 201, description: 'Atualiza comentario do feed' })
  public async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() model: UpdateComment,
    @Req() req
  ): Promise<any> {
    return this.feedCommentService.updateComment(commentId, model, req.user);
  }

  @Delete(':feedId')
  @ApiResponse({ status: 200, description: 'Deleta feed' })
  public async deleteFeed(@Param('feedId', ParseIntPipe) feedId: number, @Req() req): Promise<void> {
    return this.feedService.deleteFeed(feedId, req.user);
  }

  @Delete('comments/:commentId')
  @ApiResponse({ status: 200, description: 'Deleta comentário do feed' })
  public async deleteComment(@Param('commentId', ParseIntPipe) commentId: number, @Req() req) {
    return this.feedCommentService.deleteComment(commentId, req.user);
  }

  @Get(':feedId/likes')
  @ApiResponse({ status: 200, description: 'Listagem de likes de uma postagem' })
  public async getFeedLikes(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Query() params: PaginationQuery
  ): Promise<any> {
    return this.feedService.getFeedLikes(feedId, params);
  }

  @Put(':feedId/like')
  @ApiResponse({ status: 201, description: 'Like ou Retirar o like de uma postagem' })
  public async toggleLikeFeed(@Param('feedId', ParseIntPipe) feedId: number, @Req() req): Promise<any> {
    return this.feedService.toggleLike(feedId, req.user);
  }

  @Put('like/:feedId')
  @ApiResponse({ status: 201, description: 'Like ou Retirar o like de uma postagem' })
  @ApiBody({
    type: CreateLike
  })
  public async likeOrUnlike(
    @Param('feedId', ParseIntPipe) feedId: number,
    @Body() model: CreateLike,
    @Req() req
  ): Promise<any> {
    return this.feedService.likeOrUnlike(feedId, model, req.user);
  }

  @Post('v2')
  @ApiResponse({ status: 201, description: 'Cria a postagem do usuário' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files'))
  @ApiFile()
  public async feedImage(
    @Body() model: CreateFeed,
    @UploadedFile() files: Express.Multer.File,
    @Request() req
  ): Promise<any> {
    return await this.feedService.feedImage(model, files, req.user);
  }
}
