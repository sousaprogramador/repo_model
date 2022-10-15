import { ApiProperty } from '@nestjs/swagger';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { City } from './cities.entity';
import { DestinationsCategory } from './destinationsCategories.entity';
import { DestinationImage } from './destinationsImages.entity';
import { Interest } from './interests.entity';
import { Offer } from './offers.entity';
import { UserReview } from './usersReviews.entity';
import { Wishlist } from './wishlists.entity';

@Entity({ name: 'destinations' })
export class Destination extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column({ length: 64 })
  name: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: 'string' })
  @Column({ length: 150, nullable: true })
  image: string;

  @ApiProperty({ type: [String] })
  @Column('varchar', {
    nullable: true
  })
  tags: string | string[];

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;
  @ApiProperty({ type: 'integer' })
  @Column('int')
  cityId: number;

  @ManyToOne(() => City, city => city.destinations, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @OneToMany(() => DestinationImage, destinationImage => destinationImage.destination, {
    cascade: ['update', 'insert']
  })
  @JoinTable({
    name: 'destinationsImages'
  })
  images?: DestinationImage[] | string[];

  @ManyToMany(() => Offer, offer => offer.destinations)
  @JoinTable({
    name: 'offerHasDestinations',
    joinColumn: { name: 'destinationId' },
    inverseJoinColumn: { name: 'offerId' }
  })
  offers: Offer[];

  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'destinationsHasInterests',
    joinColumn: { name: 'destinationId' },
    inverseJoinColumn: { name: 'interestId' }
  })
  interests: Interest[] | number[];

  @ManyToMany(() => DestinationsCategory)
  @JoinTable({
    name: 'destinationsHasCategories',
    joinColumn: { name: 'destinationId' },
    inverseJoinColumn: { name: 'categoryId' }
  })
  categories: DestinationsCategory[] | number[];

  @OneToMany(() => Wishlist, wishlist => wishlist.destination)
  wishlists: Wishlist[];

  @OneToMany(() => UserReview, review => review.destination)
  reviews: UserReview[];

  // @RelationId((destination: Destination) => destination.reviews, 'reviews', qb => qb.)
  // reviewsIds: number[];

  // @RelationId((destination: Destination) => destination.wishlists)
  // wishlistsIds: number[];

  // @RelationCount((destination: Destination) => destination.reviews) // Deprecated
  @AfterLoad()
  async countRating() {
    if (!this.rating) {
      const { avg } = await UserReview.createQueryBuilder('usersReview')
        .where('usersReview.destinationId = :id', { id: this.id })
        .andWhere('usersReview.status = true')
        .select('IFNULL(AVG(rating),0)', 'avg')
        .getRawOne();

      this.rating = Number(avg);
    }
  }
  rating: number;

  @AfterLoad()
  async countReviews() {
    // if (!this.reviewsCount) {
    //   const { count } = await UserReview.createQueryBuilder('usersReview')
    //     .where('usersReview.destinationId = :id', { id: this.id })
    //     .select('COUNT(*)', 'count')
    //     .getRawOne();
    //   this.reviewsCount = Number(count);
    // }
  }
  reviewsCount: number;

  likesCount: number;

  // @RelationCount((destination: Destination) => destination.wishlists) // Deprecated
  @AfterLoad()
  async countWishlist() {
    if (!this.interestedUsers) {
      const { count } = await Wishlist.createQueryBuilder('wishlists')
        .where('wishlists.destinationId = :id', { id: this.id })
        .andWhere('wishlists.status = :status', { status: true })
        .select('COUNT(DISTINCT(wishlists.userId))', 'count')
        .getRawOne();

      this.interestedUsers = Number(count);
    }
  }
  interestedUsers: number;

  wishlisted: boolean | number;

  visited: boolean | number;

  @AfterLoad()
  async formatData() {
    if (typeof this.tags === 'string' && this.tags) {
      this.tags = this.tags.split(',');
    } else {
      this.tags = [];
    }
    if (typeof this.wishlisted === 'number') {
      this.wishlisted = this.wishlisted > 0 ? true : false;
    }

    if (typeof this.visited === 'number') {
      this.visited = this.visited > 0 ? true : false;
    }
  }
}
