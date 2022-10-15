import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Destination } from './destinations.entity';

@Entity({ name: 'blogs' })
export class Blog extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column('varchar', { length: 45 })
  title: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @ApiProperty({ type: 'string' })
  @Column('text')
  content: string;

  @ApiProperty({ type: 'string' })
  @Column('varchar')
  image: string;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToMany(() => Destination)
  @JoinTable({
    name: 'blogHasDestinations',
    joinColumn: { name: 'blogId' },
    inverseJoinColumn: { name: 'destinationId' }
  })
  destinations: Destination[] | number[];
}
