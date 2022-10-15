import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
@Entity({ name: 'usersPreferences' })
export class UserPreference extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'text'
  })
  message: string;

  @ApiProperty({ type: 'boolean' })
  @Column({
    type: 'boolean'
  })
  newMessage: boolean;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  senderId: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  recipientId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date | null;

  //   @ApiProperty({ type: 'string', format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
