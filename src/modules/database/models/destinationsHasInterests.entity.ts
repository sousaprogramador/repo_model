import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'destinationsHasInterests' })
export class DestinationHasInterests extends BaseEntity {
  @PrimaryColumn()
  destinationId: number;

  @PrimaryColumn()
  interestId: number;
}
