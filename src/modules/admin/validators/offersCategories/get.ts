import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '../common/paginationQuery';

export class ListOfferCategories extends PaginationQuery {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['position', 'id', 'name', 'icon', 'createdAt', 'updatedAt'],
    default: 'position'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;
}
