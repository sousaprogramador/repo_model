import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListUsersReviewImages extends PaginationQuery {
  @ApiProperty({ type: 'integer', required: true, default: null })
  @IsNotEmpty()
  userReviewId: number;
}
