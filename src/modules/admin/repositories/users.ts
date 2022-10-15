import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/database/models/users.entity';
import { UserInterest } from 'src/modules/database/models/usersInterests.entity';
import { UserPreference } from 'src/modules/database/models/usersPreferences.entity';
import { FindConditions, FindManyOptions, getRepository } from 'typeorm';

const allUserData: (keyof User)[] = [
  'id',
  'email',
  'password',
  'name',
  'status',
  'description',
  'birthDate',
  'friendlyName',
  'gender',
  'sexualOrientation',
  'maritalStatus',
  'languages',
  'country',
  'state',
  'city',
  'lat',
  'lon',
  'profilePhoto',
  'facebookId',
  'appleId',
  'googleId',
  'chatId',
  'rememberToken',
  'inviteCode',
  'roles',
  'relationshipId',
  'termId',
  'referralId',
  'createdAt',
  'updatedAt',
  'sendNotifications'
];
@Injectable()
export class UsersRepository {
  public async listAll(options: FindManyOptions<User>): Promise<User[]> {
    return User.find({
      ...options,
      select: allUserData,
      relations: ['term', 'relationship', 'interests', 'preferences']
    });
  }

  public async findUserByEmailAndToken(token: string, email: string): Promise<User> {
    return User.findOne(
      {
        email,
        rememberToken: token
      },
      {
        select: ['id', 'email', 'password', 'name', 'roles', 'status', 'appleId', 'googleId', 'facebookId']
      }
    );
  }

  public async findByEmail(email: string): Promise<User> {
    return User.findOne(
      {
        email
      },
      {
        select: ['id', 'email', 'password', 'name', 'roles', 'status', 'appleId', 'googleId', 'facebookId']
      }
    );
  }

  public async findByIdWithPass(id: number): Promise<User> {
    return User.findOne(id, {
      select: ['id', 'email', 'password', 'name', 'roles', 'status', 'appleId', 'googleId', 'facebookId']
    });
  }

  public async list(paginationOptions: IPaginationOptions, options: FindManyOptions<User>): Promise<Pagination<User>> {
    return paginate<User>(
      getRepository(User),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options,
        select: allUserData,
        relations: ['term', 'relationship', 'interests', 'preferences']
      }
    );
  }

  public async insert(model: User): Promise<User> {
    return User.save(model);
  }

  public async findById(id: number): Promise<User> {
    return User.findOne(id, {
      relations: ['term', 'relationship', 'interests', 'preferences'],
      select: allUserData
    });
  }

  public async update(model: User): Promise<User> {
    return User.save(model);
  }

  public async remove(id: number): Promise<void> {
    await User.delete(id);
  }

  public async findOne(where: FindConditions<User>): Promise<User> {
    return User.findOne({
      select: ['id', 'email', 'roles', 'status'],
      where
    });
  }

  public async updateInterests(userId: number, interestsId: number[]): Promise<void> {
    await UserInterest.delete({ userId });

    interestsId.map(async interestId => {
      await UserInterest.insert({
        status: true,
        userId,
        interestId
      });
    });
  }

  public async updatePreferences(userId: number, preferencesId: number[]): Promise<void> {
    await UserPreference.delete({ userId });

    preferencesId.map(async preferenceId => {
      await UserPreference.insert({
        value: 1,
        userId,
        preferenceId
      });
    });
  }
}
