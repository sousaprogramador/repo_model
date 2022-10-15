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
import { Feed } from './feeds.entity';
import { User } from './users.entity';

@Entity({ name: 'feedLikes' })
export class FeedLike extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'boolean' })
  @Column({ type: 'tinyint', nullable: true, default: true })
  like: boolean;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  userId: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  feedId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Feed, feed => feed.likes, {
    onDelete: 'CASCADE',
    cascade: ['update']
  })
  @JoinColumn({ name: 'feedId' })
  feed: Feed;

  @ManyToOne(() => User)
  user: User;
}
