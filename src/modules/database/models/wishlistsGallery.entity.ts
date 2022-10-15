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
import { Wishlist } from './wishlists.entity';

@Entity({ name: 'wishlistsGalleries' })
export class WishlistsGallery extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'integer' })
  @Column()
  galleryId: number;

  @Column()
  wishlistId: number;

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

  @ManyToOne(() => Wishlist, wishlist => wishlist.id)
  @JoinColumn({ name: 'wishlistId', referencedColumnName: 'id' })
  wishlist?: Wishlist[];
}
