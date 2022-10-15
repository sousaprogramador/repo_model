import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeed {
  @ApiProperty({
    type: 'string',
    nullable: false,
    default: 'Texto da postagem'
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    type: [String],
    nullable: false,
    default: ['urldaimage.com']
  })
  @IsArray()
  @IsOptional()
  images: string[];
}

export class CreateLike {
  @ApiProperty({
    type: 'boolean',
    nullable: false,
    default: true
  })
  @IsBoolean()
  like: boolean;
}
