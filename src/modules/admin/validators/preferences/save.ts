import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Preference } from './../../../database/models/preferences.entity';

export class CreatePreferences extends Preference {
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

  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // @Max(1)
  // defaultValue: number;

  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // @Max(1)
  // status: number;
}
