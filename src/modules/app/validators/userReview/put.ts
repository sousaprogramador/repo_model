import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { UserReviewImage } from 'src/modules/database/models/usersReviewsImages.entity';

export class UpdateUserReview {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'date', default: null })
  @IsDateString()
  tripDate?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ type: 'integer', default: 3 })
  rating: number;

  @IsString()
  @ApiProperty({ type: 'string', required: true, default: '' })
  evaluation: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false, default: [] })
  images?: UserReviewImage[] | string[];
}
