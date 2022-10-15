import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { OffersCategory } from './../../../database/models/offersCategories.entity';

export class CreateOffersCategories extends OffersCategory {
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

  @ApiProperty({
    type: 'integer',
    default: 99,
    description: 'Valor que determina a posição de retorno da categoria de oferta nas listagens'
  })
  @IsOptional()
  @IsNumber()
  position: number;
}
