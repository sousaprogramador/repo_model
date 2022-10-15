import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export enum TypeEnum {
  FOLLOW = 'FOLLOW',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  AVALIATION = 'AVALIATION'
}

export enum StatusEnum {
  UNREAD = 'unread',
  READ = 'read',
  DELETED = 'deleted'
}

export class CreateNotifications {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', default: null })
  id?: number;

  @IsOptional()
  @IsEnum(TypeEnum)
  @ApiProperty({
    default: null,
    type: 'string',
    required: false,
    enum: [Object.values(TypeEnum)]
  })
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: true })
  userId: number;

  /**
    Nos casos de ser type = FOLLOW, o originModelId será o id do usuário 
    que segue o usuário que recebeu a notificação, então pode ser NULL 
    pois já é definido na propriedade originUserId.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: false, default: null })
  originModelId?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: true })
  originUserId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: true })
  feedId?: number;

  @IsOptional()
  @IsEnum(StatusEnum)
  @ApiProperty({
    default: '"unread"',
    type: 'string',
    enum: [Object.values(StatusEnum)]
  })
  status: string;
}
