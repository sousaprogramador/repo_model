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
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Offer } from './offers.entity';

@Entity({ name: 'partners' })
export class Partner extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column('varchar', { length: 45 })
  name: string;

  @ApiProperty({ type: 'string' })
  @Column('varchar')
  logo: string;

  @ApiProperty({ type: 'string' })
  @Column('varchar', { length: 45, nullable: true })
  email: string;

  @ApiProperty({ type: 'boolean' })
  @Column({
    type: 'tinyint',
    default: true
  })
  status: boolean;

  @ApiProperty({ type: 'string' })
  @Column('varchar', { length: 512, nullable: true })
  url: string;

  @ApiProperty({ type: 'string' })
  @Column('varchar', { length: 15, nullable: true })
  phone: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: true
  })
  hideOffers: boolean;

  @ApiProperty({ type: 'string' })
  @Column('varchar', { nullable: true })
  whatsApp: string;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToMany(() => Offer, offer => offer.destinations)
  @JoinTable({
    name: 'offerHasPartners',
    joinColumn: { name: 'partnerId' },
    inverseJoinColumn: { name: 'offerId' }
  })
  offers: Offer[] | number[];

  @AfterLoad()
  formatData() {
    if (this.whatsApp && typeof this.whatsApp === 'string') {
      this.whatsApp = this.whatsApp.match(/\d+/g).join('');
    }
    if (this.phone && typeof this.phone === 'string') {
      this.phone = this.phone.match(/\d+/g).join('');
    }
  }
}
