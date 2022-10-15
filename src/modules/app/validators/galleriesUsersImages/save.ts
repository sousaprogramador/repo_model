import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGalleriesUsersImages {
  @ApiProperty({ type: 'integer' })
  @IsNotEmpty()
  @IsNumber()
  galleryId: number;

  @ApiProperty({ type: 'integer' })
  @IsNumber()
  @IsNotEmpty()
  imageId: number;
}
