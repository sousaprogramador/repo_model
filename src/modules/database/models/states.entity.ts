import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity
} from 'typeorm';

import { Country } from './countries.entity';
import { City } from './cities.entity';
@Entity({ name: 'states' })
export class State extends BaseEntity {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @Column({ length: 64 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date | null;

  @UpdateDateColumn()
  updatedAt?: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn()
  deletedAt: Date | null;
  @ApiProperty({ type: 'integer' })
  @Column('int')
  countryId: number;

  @ManyToOne(() => Country, country => country.states, {
    onDelete: 'CASCADE'
  })
  country?: Country;

  @OneToMany(() => City, cities => cities.state)
  cities?: Promise<City[]>;
}
