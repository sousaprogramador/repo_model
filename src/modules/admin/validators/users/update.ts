import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UploadProfilePhoto {
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  readonly file: Express.Multer.File;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: false })
  userId?: number;
}
export class ChangePass {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null })
  newPassword: string;

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null })
  confirmNewPassword: string;
}
