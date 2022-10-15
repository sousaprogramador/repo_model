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
import { UsersTripsGalleries } from './usersTripsGallery.entity';
@Entity({ name: 'usersTrips' })
export class UsersTrips extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column()
  filename: string;

  @ApiProperty({ type: 'integer' })
  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => UsersTripsGalleries, usersTripsGalleries => usersTripsGalleries.usersTrips)
  usersTripsGalleries: UsersTripsGalleries;
}
