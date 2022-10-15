import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserReview } from './usersReviews.entity';
@Entity({ name: 'usersReportedReviews' })
export class UserReportedReview extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ type: 'string', maxLength: 255 })
  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  userId: number;

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

  @ManyToOne(() => UserReview)
  @JoinColumn({ name: 'usersReviewId' })
  review: UserReview;
}
