import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListOffer extends PaginationQuery {
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'integer',
    description:
      'Valor aleatório para não retornar sempre a mesma lista mas que em sua paginação não se repita os dados retornados',
    example: 3123,
    default: 1000
  })
  rand: number;

  @ApiProperty({ type: 'string', format: 'date', required: false })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false })
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false })
  @IsDateString()
  @IsOptional()
  startDatePackage: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false })
  @IsDateString()
  @IsOptional()
  endDatePackage: Date;
}

export class ListOfferCustom extends ListOffer {
  // @IsArray()
  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  interests: number[];

  // @IsArray()
  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  categories: number[];

  // @IsArray()
  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  destinations: number[];

  // @IsArray()
  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  partners: number[];
}
