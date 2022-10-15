import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportReview {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, default: null })
  reason: string;
}
