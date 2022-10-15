/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Delete, Get, Param, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { UserReviewsRepository } from '../repositories/userReview';
import { ReportReviewsService } from '../services/reportReviews';
import { ListTerms } from '../validators/terms/get';

@ApiTags('Admin: Denuncias de destinos')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/reports')
export class ReportsController {
  constructor(private reportsService: ReportReviewsService, private userReviewRepository: UserReviewsRepository) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListTerms) {
    return this.reportsService.list(params);
  }

  @Put('toggle/:reviewId')
  public async disapproveReview(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.userReviewRepository.toggleStatusReview(reviewId);
  }

  @Delete(':reportId')
  public async delete(@Param('reportId', ParseIntPipe) reportId: number) {
    return this.reportsService.remove(reportId);
  }
}
