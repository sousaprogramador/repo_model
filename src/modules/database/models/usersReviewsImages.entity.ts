import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { UserReview } from './usersReviews.entity';
@Entity({ name: 'usersReviewsImages' })
export class UserReviewImage extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', maxLength: 255 })
  @Column({
    type: 'varchar'
  })
  filename: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  usersReviewId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => UserReview, userReview => userReview.images, {
    onDelete: 'CASCADE',
    cascade: ['update']
  })
  @JoinColumn({ name: 'usersReviewId' })
  userReview?: UserReview;
}
