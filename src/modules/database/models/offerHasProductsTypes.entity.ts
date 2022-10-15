import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'offerHasProductsTypes' })
export class OfferHasProductType extends BaseEntity {
  @PrimaryColumn()
  productTypeId: number;

  @PrimaryColumn()
  offerId: number;
}
