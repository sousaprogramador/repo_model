import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'offerHasPartners' })
export class OfferHasPartners extends BaseEntity {
  @PrimaryColumn()
  offerId: number;

  @PrimaryColumn()
  partnerId: number;
}
