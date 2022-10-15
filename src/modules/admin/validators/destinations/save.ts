import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { DestinationImage } from 'src/modules/database/models/destinationsImages.entity';

export class CreateDestination extends Destination {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', default: null })
  id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ type: 'string', required: true, default: null })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ApiProperty({ type: 'string', required: true, default: null })
  image: string;

  @ApiProperty({ type: [String], required: false, default: [] })
  @IsArray()
  @IsOptional()
  tags: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, required: true, default: null })
  cityId: number;

  @IsOptional()
  @ApiProperty({ type: [String], required: false, default: [] })
  images: DestinationImage[] | string[];

  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  interests: number[];

  @IsOptional()
  @ApiProperty({ type: [Number], required: false, default: [] })
  categories: number[];
}
