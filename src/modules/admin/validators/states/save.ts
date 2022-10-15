import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { State } from 'src/modules/database/models/states.entity';

export class CreateStates extends State {
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
  countryId: number;
}
