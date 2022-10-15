import { ApiProperty } from '@nestjs/swagger';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Destination } from './destinations.entity';
import { DestinationImage } from './destinationsImages.entity';
import { Interest } from './interests.entity';
import { OffersCategory } from './offersCategories.entity';
import { Partner } from './partners.entity';
import { ProductType } from './productsTypes.entity';
import { Wishlist } from './wishlists.entity';

@Entity({ name: 'offers' })
export class Offer extends BaseEntity {
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

  @ApiProperty({ type: 'string', maxLength: 15 })
  @Column({
    type: 'varchar',
    length: 15
  })
  price: string;

  @ApiProperty({ type: 'string', maxLength: 15 })
  @Column({
    type: 'varchar',
    length: 15,
    default: 'A partir de'
  })
  priceLabel: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: false
  })
  isReturnEmail: boolean;

  @ApiProperty({ type: 'string' })
  @Column('varchar')
  link: string;

  @ApiProperty({ type: String })
  @Column('varchar', { default: null, nullable: true })
  tags: string | string[];

  @ApiProperty({ type: 'string', format: 'date' })
  @Column('date')
  startDate: Date;

  @ApiProperty({ type: 'string', format: 'date' })
  @Column('date')
  endDate: Date;

  @ApiProperty({ type: 'string', format: 'date' })
  @Column('date')
  startDatePackage: Date;

  @ApiProperty({ type: 'string', format: 'date' })
  @Column('date')
  endDatePackage: Date;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToMany(() => Destination, destination => destination.offers)
  @JoinTable({
    name: 'offerHasDestinations',
    joinColumn: { name: 'offerId' },
    inverseJoinColumn: { name: 'destinationId' }
  })
  destinations: Destination[] | number[];

  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'offerHasInterests',
    joinColumn: { name: 'offerId' },
    inverseJoinColumn: { name: 'interestId' }
  })
  interests: Interest[] | number[];

  @ManyToMany(() => Partner, partner => partner.offers)
  @JoinTable({
    name: 'offerHasPartners',
    joinColumn: { name: 'offerId' },
    inverseJoinColumn: { name: 'partnerId' }
  })
  partners: Partner[] | number[];

  @ManyToMany(() => OffersCategory)
  @JoinTable({
    name: 'offersHasCategories',
    joinColumn: { name: 'offerId' },
    inverseJoinColumn: { name: 'categoryId' }
  })
  categories: OffersCategory[] | number[];

  @OneToMany(() => Wishlist, wishlist => wishlist.offer)
  wishlists: Wishlist[];

  wishlisted: boolean | number;

  @ManyToMany(() => ProductType)
  @JoinTable({
    name: 'offerHasProductsTypes',
    joinColumn: { name: 'offerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productTypeId', referencedColumnName: 'id' }
  })
  productsTypes: ProductType[] | number[];

  // Adicionar imagens dos destinos para a oferta de forma aleatória
  images?: DestinationImage[] | string[];

  @AfterLoad()
  async formatData() {
    if (typeof this.tags === 'string' && this.tags) {
      this.tags = this.tags.split(',');
    } else {
      this.tags = [];
    }

    if (typeof this.wishlisted === 'number') {
      this.wishlisted = this.wishlisted > 0 ? true : false;
    }
  }
}
