import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Destination } from 'src/modules/database/models/destinations.entity';
import { Blog } from './../../../database/models/blogs.entity';

export class CreateBlogs extends Blog {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: 'integer', required: false, default: null })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  content: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', required: true, default: null })
  image: string;

  @IsOptional()
  @ApiProperty({ type: [Destination], required: false, default: [] })
  destinations: number[];
}
