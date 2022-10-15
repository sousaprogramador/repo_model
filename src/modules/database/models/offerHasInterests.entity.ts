import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'offerHasInterests' })
export class OfferHasInterests extends BaseEntity {
  @PrimaryColumn()
  offerId: number;

  @PrimaryColumn()
  interestId: number;
}
