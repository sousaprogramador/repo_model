import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

enum WishlistType {
  OFFERS = 'offers',
  DESTINATIONS = 'destinations'
}

export class GetWishlist extends PaginationQuery {
  @ApiProperty({
    description: 'Tipo de wishlist desejada',
    enum: WishlistType,
    required: false,
    default: null
  })
  @IsOptional()
  @IsEnum(WishlistType)
  type: 'offers' | 'destinations';
}
