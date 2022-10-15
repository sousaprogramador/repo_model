import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min, ValidateIf } from 'class-validator';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { Interest } from 'src/modules/database/models/interests.entity';
import { Partner } from 'src/modules/database/models/partners.entity';
import { Offer } from './../../../database/models/offers.entity';

export class CreateOffers extends Offer {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', required: false, default: null })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  image: string;

  @ApiProperty({ type: 'string', required: false, default: null })
  price: string;

  @ApiProperty({ type: 'string', required: false, default: null })
  priceLabel: string;

  @IsBoolean()
  @ApiProperty({ type: 'boolean', required: true, default: false })
  isReturnEmail: boolean;

  @ValidateIf(offer => offer.link !== '')
  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ type: 'string', required: true, default: null })
  link: string;

  @ApiProperty({ type: [String], required: false, default: [] })
  @IsArray()
  @IsOptional()
  tags: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'date', required: true, default: null })
  startDate: Date;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'date', required: true, default: null })
  endDate: Date;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'date', required: false, default: null })
  startDatePackage: Date;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'date', required: false, default: null })
  endDatePackage: Date;

  @IsNotEmpty()
  @ApiProperty({ type: [Destination], required: false, default: [], description: 'Lista de ids de destinos' })
  destinations: number[];

  @IsOptional()
  @ApiProperty({ type: [Interest], required: false, default: [], description: 'Lista de ids de interesses' })
  interests: number[];

  @IsNotEmpty()
  @ApiProperty({ type: [Partner], required: false, default: [], description: 'Lista de ids de parceiros' })
  partners: number[];

  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [], description: 'Lista de ids das offerCategories' })
  categories: number[];

  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [], description: 'Lista de ids de ProductsTypes' })
  productsTypes: number[];
}
