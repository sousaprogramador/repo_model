import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListFeedComments extends PaginationQuery {
  @ApiProperty({ type: 'integer', required: true, default: null })
  @IsNotEmpty()
  @IsNumber()
  feedId: number;
}
