import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '../common/paginationQuery';

export class ListUsers extends PaginationQuery {
  @ApiProperty({ type: 'string', required: false })
  name: string;

  @ApiProperty({ type: 'string', required: false })
  email: string;

  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    default: 'id'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;
}
