import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blogHasDestinations' })
export class BlogHasDestinations extends BaseEntity {
  @PrimaryColumn()
  blogId: number;

  @PrimaryColumn()
  destinationId: number;
}
