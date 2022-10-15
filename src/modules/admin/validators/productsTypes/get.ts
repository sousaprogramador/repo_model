import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '../common/paginationQuery';

export class ListProductsTypes extends PaginationQuery {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['id', 'name', 'createdAt', 'updatedAt'],
    default: 'id'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;
}
