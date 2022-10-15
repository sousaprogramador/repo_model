import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Term } from './../../../database/models/terms.entity';

export class CreateTerms extends Term {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', required: true, default: null })
  id?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  text: string;

  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // @Max(1)
  // status: number;
}
