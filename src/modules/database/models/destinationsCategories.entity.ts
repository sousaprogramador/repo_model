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

@Entity({ name: 'destinationsCategories' })
export class DestinationsCategory extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column()
  name: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @ApiProperty({ type: 'integer' })
  @Column({ type: 'int', default: 0 })
  position: number;

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
