import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '../common/paginationQuery';

export class ListTerms extends PaginationQuery {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['id', 'text', 'createdAt', 'updatedAt'],
    default: 'id'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;
}
