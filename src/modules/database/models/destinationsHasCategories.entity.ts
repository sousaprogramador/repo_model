import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'destinationsHasCategories' })
export class DestinationsHasCategories extends BaseEntity {
  @PrimaryColumn()
  destinationId: number;

  @PrimaryColumn()
  categoryId: number;
}
