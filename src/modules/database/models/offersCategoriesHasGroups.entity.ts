import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'offersCategoriesHasGroups' })
export class OffersCategoriesHasGroups extends BaseEntity {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  groupId: number;
}
