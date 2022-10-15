import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ProductType } from './../../../database/models/productsTypes.entity';

export class CreateProductType extends ProductType {
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
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({ type: 'string', required: true, default: null })
  color: string;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, default: true })
  status: boolean;
}
