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
import { Feed } from './feeds.entity';
import { User } from './users.entity';

@Entity({ name: 'feedComments' })
export class FeedComment extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', required: true })
  @Column({ type: 'text', nullable: false })
  text: string;

  @ApiProperty({ type: 'integer', required: true })
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

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Feed, feed => feed.images, {
    onDelete: 'CASCADE',
    cascade: ['update']
  })
  @JoinColumn({ name: 'feedId' })
  feed: Feed;

  @ManyToOne(() => User)
  user: User;
}
