import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { Interest } from 'src/modules/database/models/interests.entity';
import { Preference } from 'src/modules/database/models/preferences.entity';

export enum SexualOrientationEnum {
  STRAIGHT = 'straight',
  HOMOSEXUAL = 'homosexual',
  BISEXUAL = 'bisexual',
  SHEMALE = 'shemale',
  OTHER = 'other'
}

export enum MaritalStatusEnum {
  MARRIED = 'married',
  SINGLE = 'single',
  DIVORCED = 'divorced',
  RELATIONSHIP = 'relationship',
  OPEN = 'open'
}

export enum LanguageEnum {
  PT = 'PT',
  EN = 'EN',
  CHI = 'CHI',
  HIN = 'hin',
  SPA = 'spa'
}

export enum RolesEnum {
  USER = 'user'
}

export class CreateUsers {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', default: null })
  id?: number;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: true, default: null, maxLength: 45 })
  email: string;

  @IsNotEmpty()
  @MaxLength(128)
  @ApiProperty({ type: 'string', required: false, maxLength: 128, default: null })
  password: string;

  @MaxLength(45)
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', required: true, maxLength: 45, default: null })
  name: string;

  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ type: 'string', required: false, maxLength: 200, default: null })
  description: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'date', required: false, default: null })
  birthDate: Date;

  @IsOptional()
  @MaxLength(64)
  @ApiProperty({ type: 'string', required: false, maxLength: 64, default: null })
  friendlyName: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, maxLength: 1, default: null })
  gender: string;

  @IsOptional()
  @IsEnum(SexualOrientationEnum)
  @ApiProperty({
    default: null,
    type: 'string',
    required: false,
    enum: [Object.values(SexualOrientationEnum)]
  })
  sexualOrientation: string;

  @IsOptional()
  @IsEnum(MaritalStatusEnum)
  @ApiProperty({
    default: null,
    type: 'string',
    required: false,
    enum: [Object.values(MaritalStatusEnum)]
  })
  maritalStatus: string;

  // @IsEnum(LanguageEnum)
  // @ApiProperty({
  //   default: null,
  //   type: 'string',
  //   required: false,
  //   enum: [Object.values(LanguageEnum)]
  // })
  @ApiProperty({ type: [String], required: false, default: null })
  @IsOptional()
  languages: string[] | string;

  @IsOptional()
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: false, maxLength: 45, default: null })
  country: string;

  @IsOptional()
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: false, maxLength: 45, default: null })
  state: string;

  @IsOptional()
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: false, maxLength: 45, default: null })
  city: string;

  @IsOptional()
  @ApiProperty({ type: 'boolean', required: false, default: true })
  status: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: 'boolean', required: false, default: true })
  sendNotifications: boolean;

  @IsOptional()
  @MaxLength(255)
  @ApiProperty({ type: 'string', required: false, maxLength: 255, default: null })
  profilePhoto: string;

  @IsOptional()
  @MaxLength(34)
  @ApiProperty({ type: 'string', required: false, maxLength: 34, default: null })
  facebookId: string;

  @IsOptional()
  @MaxLength(124)
  @ApiProperty({ type: 'string', required: false, maxLength: 124, default: null })
  appleId: string;

  @IsOptional()
  @MaxLength(60)
  @ApiProperty({ type: 'string', required: false, maxLength: 60, default: null })
  googleId: string;

  @IsOptional()
  @MaxLength(512)
  @ApiProperty({ type: 'string', required: false, maxLength: 512, default: null })
  chatId: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, format: 'date', default: null })
  lastLogin: Date;

  @IsOptional()
  @MaxLength(256)
  @ApiProperty({ type: 'string', required: false, maxLength: 256, default: null })
  rememberToken: string;

  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ type: 'string', required: false, maxLength: 256, default: null })
  tokenOneSignal: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: false, default: null })
  relationshipId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: false, default: null })
  termId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'integer', required: false, default: null })
  referralId: number;

  @IsOptional()
  @MaxLength(45)
  @ApiProperty({ type: 'string', required: false, maxLength: 45, default: null })
  inviteCode: string;

  @IsOptional()
  @ApiProperty({ type: 'string', required: false, maxLength: 45, default: null })
  accessToken: string;

  @IsOptional()
  @ApiProperty({ type: [Interest], required: false, default: [] })
  interests: number[] | Interest[];

  @IsOptional()
  @ApiProperty({ type: [Preference], required: false, default: [] })
  preferences: number[] | Preference[];

  @IsOptional()
  @IsEnum(RolesEnum)
  @ApiProperty({
    default: null,
    type: 'string',
    required: false,
    enum: ['user']
  })
  roles: string;

  @ApiProperty({
    type: 'number',
    description: 'Latitude do usuário.',
    required: false
  })
  @IsOptional()
  @IsNumber()
  lat: number;

  @ApiProperty({
    type: 'number',
    description: 'Longitude do usuário.',
    required: false
  })
  @IsOptional()
  @IsNumber()
  lon: number;

  emailConfirmationToken: string;

  emailConfirmed: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
