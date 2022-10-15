import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotification {
  @ApiProperty({
    type: 'string',
    description: 'O titulo da notificação',
    required: false
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'O texto da notificação',
    required: true,
    example: 'Mensagem da notificação'
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    type: 'number',
    description: 'O id do usuário que deverá receber a notificação',
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    type: 'number',
    description: 'data, para enviar dados adicionais nas notificações',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsNumber()
  data?: {
    feedId?: number;
    userId?: number;
    avaliationId?: number;
  };
}
