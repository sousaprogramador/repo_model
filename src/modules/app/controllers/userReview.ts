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
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';

import { UserReviewService } from '../services/userReview';
import { UserReviewImagesService } from '../services/userReviewImages';
import { ListReviews } from '../validators/userReview/get';
import { ListUsersReviewImages } from '../validators/userReview/getImages';
import { UpdateUserReview } from '../validators/userReview/put';
import { CreateReportReview } from '../validators/userReview/report';
import { CreateUserReview } from '../validators/userReview/save';

@ApiTags('App: Reviews')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/reviews')
export class UserReviewController {
  constructor(private userReviewService: UserReviewService, private userReviewImagesService: UserReviewImagesService) {}

  @Get()
  @ApiResponse({
    description: 'Listagem de reviews'
  })
  public async list(@Query() params: ListReviews) {
    return this.userReviewService.list(params);
  }

  @Get(':reviewId')
  @ApiResponse({ status: 200, type: UserReview })
  public async details(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.userReviewService.findById(reviewId);
  }

  @Post('')
  @ApiResponse({ status: 201, description: 'Adiciona uma avaliação para um desino' })
  @UseInterceptors(FilesInterceptor('images'))
  public async addReview(@Body() model: CreateUserReview, @Req() req) {
    return this.userReviewService.addReview(model, req.user);
  }

  @Post(':reviewId/report')
  @ApiResponse({ status: 201, description: 'Denúncia de review' })
  public async addReportReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() model: CreateReportReview,
    @Req() req
  ) {
    return this.userReviewService.addReportReview(reviewId, model, req.user);
  }

  @Put(':reviewId')
  @ApiResponse({ status: 200, description: 'Edita uma avaliação' })
  @ApiBody({
    type: UpdateUserReview,
    description: 'Dados para edição da avaliação'
  })
  public async updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() model: UpdateUserReview,
    @Req() req
  ) {
    return this.userReviewService.updateReview(reviewId, model, req.user);
  }

  @Delete(':reviewId')
  @ApiResponse({ status: 200, description: 'Deleta avaliação do usuário' })
  public async deleteReview(@Param('reviewId', ParseIntPipe) reviewId: number, @Req() req) {
    return this.userReviewService.deleteReview(reviewId, req.user);
  }

  @Delete('review-image/:reviewImageId')
  @ApiResponse({ status: 200, description: 'Deleta imagem da avaliação do usuário' })
  public async deleteReviewImage(@Param('reviewImageId', ParseIntPipe) reviewImageId: number, @Req() req) {
    return this.userReviewImagesService.remove(reviewImageId, req.user);
  }

  @Get('review-image')
  @ApiResponse({ status: 200, description: 'Retorna as imagens de um review' })
  public async getReviewImages(
    // @Param('reviewId', ParseIntPipe) reviewId: number,
    @Query() params: ListUsersReviewImages
  ) {
    return this.userReviewImagesService.list(params);
  }
}
