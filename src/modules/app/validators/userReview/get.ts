import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListUsersReview extends PaginationQuery {
  @ApiProperty({ type: 'integer', required: false })
  @IsOptional()
  destinationId: number;
}

export class ListReviews extends ListUsersReview {
  @ApiProperty({ type: 'integer', required: true })
  @IsOptional()
  @IsNotEmpty()
  destinationId: number;
}
