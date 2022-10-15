import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'offerHasDestinations' })
export class OfferHasDestinations extends BaseEntity {
  @PrimaryColumn()
  offerId: number;

  @PrimaryColumn()
  destinationId: number;
}
