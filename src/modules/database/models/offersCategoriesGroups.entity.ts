import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { OffersCategory } from './offersCategories.entity';

@Entity({ name: 'offersCategoriesGroups' })
export class OffersCategoriesGroups extends BaseEntity {
  constructor(data?: Partial<OffersCategoriesGroups>) {
    super();

    if (data) {
      const dataAttributes = JSON.parse(JSON.stringify(data));
      Object.assign(this, dataAttributes);
    }
  }

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

  @ApiProperty({ type: 'string', maxLength: 255, default: null })
  @Column({
    length: 255,
    nullable: true
  })
  icon: string;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToMany(() => OffersCategory)
  @JoinTable({
    name: 'offersCategoriesHasGroups',
    joinColumn: { name: 'groupId' },
    inverseJoinColumn: { name: 'categoryId' }
  })
  categories: OffersCategory[] | number[];
}
