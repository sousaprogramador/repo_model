import { ApiProperty } from '@nestjs/swagger';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { Country } from './countries.entity';
import { Destination } from './destinations.entity';

import { State } from './states.entity';

@Entity({ name: 'cities' })
export class City extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ required: false, type: 'integer' })
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
  @ApiProperty({ required: true, type: 'integer' })
  @Column('int')
  stateId: number;

  @ManyToOne(() => State, state => state.cities, {
    onDelete: 'CASCADE'
  })
  state?: State;

  @OneToMany(() => Destination, destination => destination.city)
  destinations: Promise<Destination[]>;

  country: Country;
}
