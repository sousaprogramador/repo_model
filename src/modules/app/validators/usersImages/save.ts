import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersImages {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @IsString()
  galleryId: string;
}
