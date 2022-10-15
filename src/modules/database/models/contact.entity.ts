import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'contact' })
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ required: false, type: 'integer' })
  id?: number;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: [
      'help',
      'partnership',
      'suggestion',
      'problem',
      'story',
      'fakeAccount',
      'minor',
      'hateSpeech',
      'invalidAccount',
      'porn',
      'other'
    ],
    nullable: true
  })
  subject: string;

  @ApiProperty({ type: 'boolean', maxLength: 1, default: null })
  @Column({
    type: 'boolean',
    default: false
  })
  complaint: boolean;

  @ApiProperty({ type: 'string', maxLength: 200, default: null })
  @Column({ length: 200, nullable: true })
  description: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int'
  })
  userId: number;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User)
  user: User;
}
