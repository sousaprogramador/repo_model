import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Destination } from './destinations.entity';

@Entity({ name: 'destinationsImages' })
export class DestinationImage extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column({
    length: 255
  })
  path: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'int'
  })
  destinationId: number;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  // @CreateDateColumn()
  // createdAt: Date | null;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  // @UpdateDateColumn()
  // updatedAt: Date | null;

  // @ApiProperty({ type: 'string', format: 'date-time' })
  // @DeleteDateColumn()
  // deletedAt: Date | null;

  @ManyToOne(() => Destination, destination => destination.images, {
    onDelete: 'CASCADE',
    cascade: ['update']
  })
  @JoinColumn({ name: 'destinationId' })
  destination?: Destination;
}
