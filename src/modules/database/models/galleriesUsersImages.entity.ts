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
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Gallery } from './galleries.entity';
import { UsersImages } from './usersImages.entity';
@Entity({ name: 'galleriesUsersImages' })
export class GalleriesUsersImages extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'integer' })
  @Column()
  galleryId: number;

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

  @ManyToOne(() => UsersImages, usersImages => usersImages.userImages)
  @JoinColumn({ name: 'imageId', referencedColumnName: 'id' })
  galeriesUsersImages?: UsersImages[];
}
