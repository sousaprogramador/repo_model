import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '../common/paginationQuery';

export class ListOfferGroupCategories extends PaginationQuery {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['id', 'name', 'icon', 'createdAt', 'updatedAt'],
    default: 'id'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;
}
