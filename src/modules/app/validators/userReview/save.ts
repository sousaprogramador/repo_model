import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { UserReviewImage } from 'src/modules/database/models/usersReviewsImages.entity';

export class CreateUserReview {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: true, default: null })
  destinationId: number;

  // @IsInt()
  // @Min(0)
  // @ApiProperty({ type: 'integer', default: null })
  // userId: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: 'string', format: 'date', default: null })
  tripDate?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ type: 'integer', default: 3 })
  rating: number;

  @IsString()
  @ApiProperty({ type: 'string', required: true, default: '' })
  evaluation: string;

  // @IsBoolean()
  // @ApiProperty({ type: 'boolean', required: true, default: true })
  // feed: boolean;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false, default: [] })
  images?: UserReviewImage[] | string[];
}
