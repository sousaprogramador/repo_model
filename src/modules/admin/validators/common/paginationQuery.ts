import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({ type: 'integer', required: false })
  @IsOptional()
  page: number;

  @ApiProperty({ type: 'integer', required: false })
  @IsOptional()
  limit: number;
}
