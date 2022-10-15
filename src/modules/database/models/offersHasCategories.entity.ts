import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'offersHasCategories' })
export class OffersHasCategories extends BaseEntity {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  offerId: number;
}
