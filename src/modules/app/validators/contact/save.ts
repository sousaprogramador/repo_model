import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Contact } from 'src/modules/database/models/contact.entity';

export class CreateContact extends Contact {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', required: true, default: null })
  id?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  subject: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: 'boolean', required: false, default: false })
  complaint: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  description: string;

  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // @Max(1)
  // status: number;
}
