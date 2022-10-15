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
  JoinColumn
} from 'typeorm';
import { Gallery } from './galleries.entity';
import { UsersTrips } from './usersTrips.entity';
@Entity({ name: 'usersTripsGalleries' })
export class UsersTripsGalleries extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'integer' })
  @Column()
  galleryId: number;

  @ApiProperty({ type: 'integer' })
  @Column()
  imageId: number;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Gallery, gallery => gallery.id)
  @JoinColumn({ name: 'galleryId', referencedColumnName: 'id' })
  galleries: Gallery;

  @ManyToOne(() => UsersTrips, usersTrips => usersTrips.id)
  @JoinColumn({ name: 'imageId', referencedColumnName: 'id' })
  usersTrips?: UsersTrips[];
}
