import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'terms' })
export class Term extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'text' })
  text: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => User, user => user.term)
  users: User[];
}
