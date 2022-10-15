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
  OneToOne,
  JoinColumn
} from 'typeorm';
import { AggregatedNotifications } from './aggregatedNotifications.entity';
import { FeedComment } from './feedComments.entity';
import { FeedLike } from './feedLikes.entity';
import { Follow } from './follows.entity';
import { User } from './users.entity';

@Entity({ name: 'notifications' })
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: ['follow', 'like', 'comment', 'avaliation'],
    nullable: true
  })
  type: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  userId: number;

  @ApiProperty({ type: 'integer', default: null })
  @Column({
    type: 'int',
    nullable: true
  })
  originModelId: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  originUserId: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int',
    nullable: true,
    default: null
  })
  aggregatedNotificationId: number;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: ['unread', 'read', 'deleted'],
    default: 'unread'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User)
  user: User;

  // @OneToOne(() => User)
  // @JoinColumn("")
  // originUser: User;

  @ManyToOne(() => AggregatedNotifications, aggregatedNotifications => aggregatedNotifications.notifications)
  aggregatedNotification: AggregatedNotifications;

  // @ManyToOne(() => FeedComment)
  // feedComment: FeedComment;

  // @ManyToOne(() => FeedLike)
  // feedLike: FeedLike;

  // @ManyToOne(() => Follow)
  // follow: Follow;
}
