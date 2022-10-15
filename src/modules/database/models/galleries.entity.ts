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
import { GalleriesUsersImages } from './galleriesUsersImages.entity';
import { WishlistsGallery } from './wishlistsGallery.entity';
import { UsersTripsGalleries } from './usersTripsGallery.entity';
@Entity({ name: 'galleries' })
export class Gallery extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column()
  name: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'enum',
    enum: ['gallery', 'trips', 'wishlists'],
    default: 'gallery'
  })
  type: string;

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

  @OneToMany(() => GalleriesUsersImages, galleriesUsersImages => galleriesUsersImages.galleries)
  galeriesUsers?: GalleriesUsersImages[];

  @OneToMany(() => WishlistsGallery, wishlistsGallery => wishlistsGallery.galleries)
  wishlistsGallery?: WishlistsGallery[];

  @OneToMany(() => UsersTripsGalleries, usersTripsGalleries => usersTripsGalleries.galleries)
  usersTripsGalleries?: UsersTripsGalleries[];
}
