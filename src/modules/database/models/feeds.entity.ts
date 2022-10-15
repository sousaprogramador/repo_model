import { ApiProperty } from '@nestjs/swagger';
import {
  AfterLoad,
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
import { AggregatedNotifications } from './aggregatedNotifications.entity';
import { FeedComment } from './feedComments.entity';
import { FeedImage } from './feedImages.entity';
import { FeedLike } from './feedLikes.entity';
import { User } from './users.entity';

@Entity({ name: 'feeds' })
export class Feed extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'text', nullable: true })
  text: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  userId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, user => user.feeds)
  user: User;

  @OneToMany(() => FeedImage, feedImage => feedImage.feed, {
    cascade: ['update', 'insert']
  })
  @JoinTable({
    name: 'feedImages'
  })
  images?: FeedImage[] | string[];

  @OneToMany(() => FeedComment, feedComment => feedComment.feed, {
    cascade: ['update', 'insert']
  })
  @JoinTable({
    name: 'feedComments'
  })
  comments: FeedComment[];

  @OneToMany(() => FeedLike, feedLike => feedLike.feed, {
    cascade: ['update', 'insert']
  })
  @JoinTable({
    name: 'feedLikes'
  })
  likes: FeedLike[];

  @AfterLoad()
  async countLikes() {
    if (!this.likesCount) {
      const { count } = await FeedLike.createQueryBuilder('feedLikes')
        .select('COUNT(DISTINCT(feedLikes.userId))', 'count')
        .where('feedLikes.feedId = :id', { id: this.id })
        .andWhere('feedLikes.deletedAt IS NULL')
        .andWhere('feedLikes.like = true')
        .getRawOne();

      this.likesCount = Number(count);
    }
  }
  likesCount: number;

  @AfterLoad()
  async countComments() {
    if (!this.commentsCount) {
      const { count } = await FeedComment.createQueryBuilder('feedComments')
        .where('feedComments.feedId = :id', { id: this.id })
        .select('COUNT(*)', 'count')
        .andWhere('feedComments.deletedAt IS NULL')
        .getRawOne();

      this.commentsCount = Number(count);
    }
  }
  commentsCount: number;

  @AfterLoad()
  async loadLastComments() {
    if (!this.comments) {
      const lastComments = await FeedComment.createQueryBuilder('feedComments')
        .where('feedComments.feedId = :id', { id: this.id })
        .andWhere('feedComments.deletedAt IS NULL')
        .leftJoinAndSelect('feedComments.user', 'commentsUser')
        .orderBy('feedComments.createdAt', 'DESC')
        .limit(3)
        .getMany();
      this.comments = lastComments.reverse();
    }
  }

  isLiked: boolean;

  @AfterLoad()
  async formatData() {
    if (typeof this.isLiked === 'number') {
      this.isLiked = this.isLiked > 0 ? true : false;
    }
  }

  @OneToMany(() => AggregatedNotifications, aggregatedNotifications => aggregatedNotifications.feed)
  aggregatedNotifications: AggregatedNotifications[];
}
