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
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Feed } from './feeds.entity';
import { Notifications } from './notifications.entity';
import { User } from './users.entity';

@Entity({ name: 'aggregatedNotifications' })
export class AggregatedNotifications extends BaseEntity {
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
  originFeedId: number;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: ['unread', 'read', 'deleted'],
    default: 'unread'
  })
  lastStatus: string;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({
    type: 'datetime',
    nullable: true
  })
  lastUpdatedAtNotifications: Date | null;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Notifications, notification => notification.aggregatedNotification, { eager: false })
  notifications: Notifications[];

  @ManyToOne(() => Feed, feed => feed.aggregatedNotifications)
  @JoinColumn({ name: 'originFeedId' })
  feed: Feed;
}
