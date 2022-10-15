import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListFeeds extends PaginationQuery {
  // @ApiProperty({ type: 'boolean', required: false, default: false })
  // isFeed: boolean;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  search: number;

  @ApiProperty({
    type: 'integer',
    description:
      'Valor aleatório para não retornar sempre a mesma lista mas que em sua paginação não se repita os dados retornados',
    example: 3123,
    default: 1000
  })
  rand: number;
}
