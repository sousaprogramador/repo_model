import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLastStatus {
  @ApiProperty({
    type: 'string',
    nullable: false,
    default: 'Status da Notificação [read, unread, deleted]',
    enum: ['read', 'unread', 'deleted']
  })
  @IsEnum(['read', 'unread', 'deleted'])
  @IsNotEmpty()
  status: string;
}
