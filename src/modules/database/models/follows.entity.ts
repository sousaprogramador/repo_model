import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Unique,
  ManyToOne
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'follows' })
@Unique(['followerId', 'followedId'])
export class Follow extends BaseEntity {
  constructor(data?: Partial<Follow>) {
    super();

    if (data) {
      const dataAttributes = JSON.parse(JSON.stringify(data));
      Object.assign(this, dataAttributes);
    }
  }

  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  followerId: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  followedId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, user => user.follows)
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  followed: User;

  imFollowing?: boolean;

  followMe?: boolean;
}
