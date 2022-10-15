import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Invitation {
  @IsNotEmpty()
  @ApiProperty({ type: 'array', required: true, default: [] })
  emails: Array<string>;
}
