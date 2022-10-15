import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { DestinationsCategory } from './../../../database/models/destinationsCategories.entity';

export class CreateDestinationsCategories extends DestinationsCategory {
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
  @IsInt()
  @Min(0)
  @Max(999)
  @ApiProperty({ type: 'integer', required: false, default: null })
  position: number;
}
