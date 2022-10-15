import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Feed } from './feeds.entity';

@Entity({ name: 'feedImages' })
export class FeedImage extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', required: true })
  @Column({ type: 'varchar', nullable: false })
  filename: string;

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

  @ManyToOne(() => Feed, feed => feed.images, {
    onDelete: 'CASCADE',
    cascade: ['update']
  })
  @JoinColumn({ name: 'feedId' })
  feed: Feed;
}
