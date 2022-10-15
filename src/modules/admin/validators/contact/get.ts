import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListContacts extends PaginationQuery {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: [
      'help',
      'partnership',
      'suggestion',
      'problem',
      'story',
      'fakeAccount',
      'minor',
      'hateSpeech',
      'invalidAccount',
      'porn',
      'other'
    ],
    default: null
  })
  subject: string;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, default: false })
  complaint: boolean;

  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['id', 'subject', 'createdAt', 'updatedAt'],
    default: 'id'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;
}
