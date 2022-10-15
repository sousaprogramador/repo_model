import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ListUnreadNotifications {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  statusIconNotifications: string;

  @ApiProperty({
    type: 'integer',
    required: true
  })
  totalUnreadNotifications: number;
}
