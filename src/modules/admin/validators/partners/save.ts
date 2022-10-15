import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, IsUrl } from 'class-validator';
import { Partner } from './../../../database/models/partners.entity';

export class CreatePartners extends Partner {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', required: false, default: null })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  logo: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null })
  email: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ type: 'string', required: false, default: null })
  url: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null })
  phone: string;

  @IsBoolean()
  @ApiProperty({ type: 'boolean', required: true, default: true })
  hideOffers: boolean;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, default: null })
  whatsApp: string;
}
