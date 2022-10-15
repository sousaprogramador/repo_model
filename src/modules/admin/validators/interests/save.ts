import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Interest } from './../../../database/models/interests.entity';

export class CreateInterests extends Interest {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', required: true, default: null })
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ type: 'string', required: true, default: null })
  name: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  icon: string;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: true, default: true })
  status: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  @ApiProperty({ type: 'integer', required: true, default: null })
  position: number;
}
