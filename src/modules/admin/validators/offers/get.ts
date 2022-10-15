import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '../common/paginationQuery';

export class ListOffers extends PaginationQuery {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['id', 'title', 'createdAt', 'updatedAt', 'startDate', 'endDate'],
    default: 'id'
  })
  orderBy: string;

  @ApiProperty({ type: 'string', required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  order: string;

  @ApiProperty({ type: 'string', required: false })
  search: string;
}
