import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { Avaliation } from './avaliations.entity';
import { Feed } from './feeds.entity';
import { Follow } from './follows.entity';
import { Interest } from './interests.entity';
import { Preference } from './preferences.entity';
import { Relationship } from './relationships.entity';
import { Term } from './terms.entity';
import { Wishlist } from './wishlists.entity';
import { FollowsRepository } from '../../app/repositories/follows';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @ApiProperty({ type: 'integer', default: null })
  @PrimaryGeneratedColumn('increment')
  @Generated('increment')
  id?: number;

  @ApiProperty({ type: 'string', maxLength: 45 })
  @Column({ length: 45, select: false })
  email: string;

  @ApiProperty({ type: 'string', maxLength: 128, default: null })
  @Column({ length: 128, nullable: true, select: false })
  password: string;

  @ApiProperty({ type: 'string', maxLength: 64 })
  @Column({ length: 64 })
  name: string;

  @ApiProperty({ type: 'string', maxLength: 200, default: null })
  @Column({ length: 200, nullable: true })
  description: string;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @Column({
    type: 'date',
    nullable: true
  })
  birthDate: Date;

  @ApiProperty({ type: 'string', maxLength: 64, default: null })
  @Column({
    length: 64,
    nullable: true
  })
  friendlyName: string;

  @ApiProperty({ type: 'string', minLength: 1, maxLength: 1 })
  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    select: false
  })
  gender: string;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: ['straight', 'homosexual', 'bisexual', 'shemale', 'other'],
    nullable: true,
    select: false
  })
  sexualOrientation: string;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: ['married', 'single', 'divorced', 'relationship', 'open'],
    nullable: true,
    select: false
  })
  maritalStatus: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    select: false
  })
  tokenOneSignal: string;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'varchar',
    nullable: true,
    select: false
  })
  languages: string | string[];

  @ApiProperty({ type: 'string', maxLength: 45, default: null })
  @Column({
    length: 45,
    nullable: true,
    select: false
  })
  country: string;

  @ApiProperty({ type: 'string', maxLength: 45, default: null })
  @Column({
    length: 45,
    nullable: true,
    select: false
  })
  state: string;

  @ApiProperty({ type: 'string', maxLength: 45, default: null })
  @Column({
    length: 45,
    nullable: true,
    select: false
  })
  city: string;

  @ApiProperty({ type: 'boolean', maxLength: 1, default: null })
  @Column({
    type: 'boolean',
    default: true,
    select: false
  })
  status: boolean;

  @ApiProperty({ type: 'boolean', default: true })
  @Column({
    type: 'boolean',
    default: true,
    select: true
  })
  sendNotifications: boolean;

  @ApiProperty({ type: 'string', maxLength: 255, default: null })
  @Column({
    length: 255,
    nullable: true
  })
  profilePhoto: string;

  @ApiProperty({ type: 'string', maxLength: 34, default: null })
  @Column({
    length: 34,
    nullable: true,
    select: false
  })
  facebookId: string;

  @ApiProperty({ type: 'string', maxLength: 124, default: null })
  @Column({
    length: 124,
    nullable: true,
    select: false
  })
  appleId: string;

  @ApiProperty({ type: 'string', maxLength: 60, default: null })
  @Column({
    length: 60,
    nullable: true,
    select: false
  })
  googleId: string;

  @ApiProperty({ type: 'string', maxLength: 512, default: null })
  @Column({
    length: 512,
    nullable: true,
    select: false
  })
  chatId: string;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @Column({
    type: 'datetime',
    nullable: true,
    select: false
  })
  lastLogin: Date;

  @ApiProperty({ type: 'string', maxLength: 255, default: null })
  @Column({
    length: 255,
    nullable: true,
    select: false
  })
  rememberToken: string;

  @ApiProperty({
    type: 'decimal',
    description: 'Latitude do usuário.',
    required: false
  })
  @Column({
    nullable: true
  })
  lat: number;

  @ApiProperty({
    type: 'decimal',
    description: 'Longitude do usuário.',
    required: false
  })
  @Column({
    nullable: true
  })
  lon: number;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @CreateDateColumn({ select: false })
  createdAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @UpdateDateColumn({ select: false })
  updatedAt: Date | null;

  @ApiProperty({ type: 'string', format: 'date-time', default: null })
  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date | null;

  @ApiProperty({ type: 'string', maxLength: 45 })
  @Column({
    length: 45,
    nullable: true,
    select: false
  })
  inviteCode: string;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int',
    nullable: true,
    select: false
  })
  relationshipId: number;

  @ApiProperty({ type: 'integer' })
  @Column('int', { select: false })
  termId: number;

  @ApiProperty({ type: 'integer' })
  @Column({
    type: 'int',
    nullable: true,
    select: false
  })
  referralId: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'sysAdmin'],
    default: 'user',
    select: false
  })
  roles: string;

  @Column({
    length: 6,
    nullable: true,
    select: false
  })
  emailConfirmationToken: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: 'enum',
    enum: ['NOT_CONFIRMED', 'CONFIRMED', 'REGISTERED_BEFORE'],
    default: 'NOT_CONFIRMED',
    select: false
  })
  emailConfirmed: string;

  @ApiProperty({ type: 'string' })
  @Column({
    length: 16,
    nullable: true,
    select: false
  })
  phoneNumber: string;

  @ApiProperty({ type: 'string', default: null })
  @Column({
    type: 'enum',
    enum: ['read', 'unread'],
    default: 'read'
  })
  statusIconNotifications: string;

  @ManyToOne(() => Term, term => term.users)
  @JoinColumn({ name: 'termId' })
  term: Term;

  @ManyToOne(() => Relationship, relationship => relationship.users)
  @JoinColumn({ name: 'relationshipId' })
  relationship: Relationship;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referralId' })
  referral: User;

  @ManyToMany(() => Interest)
  @JoinTable({
    name: 'usersInterests',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'interestId' }
  })
  interests: Interest[] | number[];

  // @RelationId((user: User) => user.interests)
  // interestsIds: number[];

  @ManyToMany(() => Preference)
  @JoinTable({
    name: 'usersPreferences',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'preferenceId' }
  })
  preferences: Preference[] | number[];

  @OneToMany(() => Wishlist, wishlist => wishlist.user)
  wishlists: Wishlist[];

  @OneToMany(() => Feed, wishlist => wishlist.user)
  feeds: Feed[];

  @OneToMany(() => Avaliation, avaliation => avaliation.user)
  avaliations: Avaliation[];

  @OneToMany(() => Avaliation, avaliation => avaliation.originUser)
  reviews: Avaliation[];

  @OneToMany(() => Follow, follow => follow.follower)
  follows: Follow[];

  @OneToMany(() => Follow, follow => follow.followed)
  followers: Follow[];

  isMissingData: boolean;

  followData?: { followsNumber: number; followersNumber: number };
  followMe?: boolean;
  imFollowing?: boolean;

  avaliationsMean?: number;
  avaliationsCount?: number;

  @AfterLoad()
  async formatData() {
    if (typeof this.languages === 'string' && this.languages) {
      this.languages = this.languages.split(',');
    } else {
      this.languages = [];
    }

    if (this.createdAt) {
      const now = dayjs();
      const createdAt = dayjs(this.createdAt);
      this.isNew = createdAt.diff(now, 'days') >= -7;
    }
  }

  tripperPercent: number;

  isNew: boolean;
}
