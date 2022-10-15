import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComment {
  @ApiProperty({
    name: 'text',
    type: 'string',
    default: 'Texto do comentário'
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    name: 'feedId',
    type: 'integer'
  })
  @IsNumber()
  @IsNotEmpty()
  feedId: number;
}

export class UpdateComment {
  @ApiProperty({
    name: 'text',
    type: 'string',
    default: 'Texto do comentário'
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}
