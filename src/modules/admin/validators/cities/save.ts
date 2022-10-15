import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { City } from 'src/modules/database/models/cities.entity';

export class CreateCities extends City {
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

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: true, default: null })
  stateId: number;
}
