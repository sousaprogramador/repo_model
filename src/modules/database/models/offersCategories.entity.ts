import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'offersCategories' })
export class OffersCategory extends BaseEntity {
  constructor(data?: Partial<OffersCategory>) {
    super();

    if (data) {
      const dataAttributes = JSON.parse(JSON.stringify(data));
      Object.assign(this, dataAttributes);
    }
  }

  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string' })
  @Column()
  name: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'boolean',
    default: true
  })
  status: boolean;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int',
    default: null,
    nullable: true
  })
  position: number;

  @ApiProperty({ type: 'string', maxLength: 255, default: null })
  @Column({
    length: 255,
    nullable: true
  })
  icon: string;

  @CreateDateColumn()
  createdAt: Date | null;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
