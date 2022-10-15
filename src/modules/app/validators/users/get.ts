import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { PaginationQuery } from '../common/paginationQuery';

export class ListSearchUsers extends PaginationQuery {
  @ApiProperty({
    description: "Id's dos interesses",
    required: false,
    nullable: true,
    type: Array
  })
  @IsArray()
  @IsOptional()
  interests: [string] | string;

  @ApiProperty({
    description: "Id's das preferencias",
    required: false,
    nullable: true,
    type: Array
  })
  @IsArray()
  @IsOptional()
  preferences: [string] | string;

  // EMAIL OU NAME
  @ApiProperty({
    description: 'Email ou nome do usuário',
    required: false,
    nullable: true,
    type: 'string'
  })
  @IsString()
  @IsOptional()
  search: string;

  // IDADE
  @ApiProperty({
    description: 'Data de nascimento mínima',
    type: 'date',
    required: false
  })
  @IsOptional()
  @IsDateString()
  ageFrom: Date;

  @ApiProperty({
    description: 'Data de nascimento máxima',
    type: 'date',
    required: false
  })
  @IsOptional()
  @IsDateString()
  ageTo: Date;
  // GENERO
  // Interesses

  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    description: 'Genero',
    default: ''
  })
  gender: string;

  @ApiProperty({
    type: 'integer',
    description:
      'Valor aleatório para não retornar sempre a mesma lista mas que em sua paginação não se repita os dados retornados',
    example: 3123,
    default: 1000
  })
  rand: number;

  @ApiProperty({
    type: 'integer',
    description: 'Id do destino marcado como wishlist',
    example: null,
    default: null,
    required: false
  })
  @IsOptional()
  destinationId: number;

  @ApiProperty({
    type: 'decimal',
    description: 'Distância para busca do raio de uma cidade.',
    required: false
  })
  @IsOptional()
  distance: number;

  @ApiProperty({
    type: 'decimal',
    description: 'Latitude do usuário.',
    required: false
  })
  @IsOptional()
  lat: number;

  @ApiProperty({
    type: 'decimal',
    description: 'Longitude do usuário.',
    required: false
  })
  @IsOptional()
  lon: number;
}

export class ListUsers extends PaginationQuery {
  @ApiProperty({
    type: 'integer',
    description:
      'Valor aleatório para não retornar sempre a mesma lista mas que em sua paginação não se repita os dados retornados',
    example: 3123,
    default: 1000
  })
  rand: number;
}

export class CheckEmail {
  @ApiProperty({ type: 'string', required: true, default: 'E-mail do usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class CheckPhoneNumber {
  @ApiProperty({ type: 'string', required: true, default: 'Telefone do usuário' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
