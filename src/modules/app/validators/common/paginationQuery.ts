import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({ type: 'integer', required: false, default: 1 })
  @IsOptional()
  page: number;

  @ApiProperty({ type: 'integer', required: false, default: 10 })
  @IsOptional()
  limit: number;
}
