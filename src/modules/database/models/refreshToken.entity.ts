import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'refreshToken' })
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('int')
  userId: number;

  @Column('varchar')
  refreshToken: string;

  @Column('int')
  expiresIn: number;
}
