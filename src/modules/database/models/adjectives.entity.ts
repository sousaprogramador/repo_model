import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Avaliation } from './avaliations.entity';

@Entity({ name: 'adjectives' })
class Adjective extends BaseEntity {
  constructor(data?: Partial<Adjective>) {
    super();

    if (data) {
      const dataAttributes = JSON.parse(JSON.stringify(data));
      Object.assign(this, dataAttributes);
    }
  }

  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', required: true })
  @Column({ type: 'varchar', length: 255 })
  text: string;

  @ApiProperty({ type: 'string', required: true })
  @Column({ type: 'varchar', length: 500 })
  icon: string;

  @ApiProperty({ type: 'decimal', required: true })
  @Column({ type: 'decimal', precision: 2, scale: 4 })
  minRating: number;

  @ApiProperty({ type: 'decimal', required: true })
  @Column({ type: 'decimal', precision: 2, scale: 4 })
  maxRating: number;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToMany(() => Avaliation, avaliation => avaliation.adjectives)
  avaliation: Avaliation;
}

export { Adjective };
