import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateWishlist {
  @IsInt()
  @IsOptional()
  @ApiProperty({ type: 'integer', default: null })
  destinationId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ type: 'integer', default: null })
  offerId: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: 'string', format: 'date', default: '' })
  tripDate?: string;

  @ApiProperty({ type: 'integer' })
  @IsOptional()
  galleryId?: number;
}
