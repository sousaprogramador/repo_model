import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DashboardPaginationQuery {
  @ApiProperty({ type: 'integer', required: false, default: 1 })
  @IsOptional()
  page: number;

  @ApiProperty({ type: 'integer', required: false, default: 10 })
  @IsOptional()
  limit: number;

  @ApiProperty({
    type: 'integer',
    description:
      'Valor aleatório para não retornar sempre a mesma lista mas que em sua paginação não se repita os dados retornados',
    example: 3123,
    default: 1000
  })
  rand: number;

  @ApiProperty({ type: 'integer', required: false })
  @IsOptional()
  offersCategoryId: number;
}
