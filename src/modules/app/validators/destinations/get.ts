import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListDestination extends PaginationQuery {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: 'integer', required: false })
  @IsOptional()
  cityId: number;

  @ApiProperty({
    type: 'integer',
    description:
      'Valor aleatório para não retornar sempre a mesma lista mas que em sua paginação não se repita os dados retornados',
    example: 3123,
    default: 1000
  })
  @IsNotEmpty()
  rand: number;

  @ApiProperty({
    description: "Id's dos interesses",
    required: false,
    nullable: true,
    type: Array || String
  })
  @IsArray()
  @IsOptional()
  interests: [string] | string;
}
