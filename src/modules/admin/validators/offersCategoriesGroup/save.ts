import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { OffersCategoriesGroups } from './../../../database/models/offersCategoriesGroups.entity';

export class CreateOffersGroupsCategories extends OffersCategoriesGroups {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', default: null })
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ type: 'string', required: true, default: null })
  name: string;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, default: true })
  status: boolean;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null })
  icon: string;

  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  categories: number[];
}
