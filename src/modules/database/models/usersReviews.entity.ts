import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Destination } from './destinations.entity';
import { User } from './users.entity';
import { UserReportedReview } from './usersReportedReviews.entity';
import { UserReviewImage } from './usersReviewsImages.entity';
@Entity({ name: 'usersReviews' })
export class UserReview extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'integer', maxLength: 5 })
  @Column({
    type: 'int'
  })
  rating: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'text'
  })
  evaluation: string;

  @ApiProperty({ type: 'boolean' })
  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @ApiProperty({ type: 'string', format: 'date' })
  @Column({
    type: 'date'
  })
  tripDate: string;

  // @ApiProperty({ type: 'boolean' })
  // @Column({
  //   type: 'boolean',
  //   default: false
  // })
  // feed: boolean;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  userId: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  destinationId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Destination)
  destination: Destination;

  @OneToMany(() => UserReviewImage, userReviewImage => userReviewImage.userReview)
  @JoinTable({
    name: 'usersReviewsImages'
  })
  images: UserReviewImage[];

  @OneToMany(() => UserReportedReview, report => report.review)
  reports: UserReportedReview[];
}
