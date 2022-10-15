import { ApiProperty } from '@nestjs/swagger';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Destination } from './destinations.entity';
import { Offer } from './offers.entity';
import { User } from './users.entity';
import { WishlistsGallery } from './wishlistsGallery.entity';
@Entity({ name: 'wishlists' })
export class Wishlist extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', format: 'date', default: null })
  @Column({
    type: 'date',
    nullable: true,
    default: null
  })
  tripDate: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  userId: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  destinationId: number;

  @Column({
    type: 'tinyint'
  })
  status: boolean;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  offerId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, user => user.wishlists)
  user: User;

  @ManyToOne(() => Destination)
  destination: Destination;

  @ManyToOne(() => Offer)
  offer: Offer;

  wishlisted: boolean | number;

  @OneToMany(() => WishlistsGallery, wishlistsGallery => wishlistsGallery.wishlist)
  wishlistGallery: WishlistsGallery;

  @AfterLoad()
  async formatData() {
    if (typeof this.wishlisted === 'number') {
      this.wishlisted = this.wishlisted > 0 ? true : false;
    }
  }
}
