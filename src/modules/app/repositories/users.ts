import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { CreateUsers } from 'src/modules/app/validators/users/save';
import * as IPagination from 'src/modules/common/services/pagination';
import { FeedComment } from 'src/modules/database/models/feedComments.entity';
import { FeedLike } from 'src/modules/database/models/feedLikes.entity';
import { Feed } from 'src/modules/database/models/feeds.entity';
import { Follow } from 'src/modules/database/models/follows.entity';
import { Interest } from 'src/modules/database/models/interests.entity';
import { RefreshToken } from 'src/modules/database/models/refreshToken.entity';
import { User } from 'src/modules/database/models/users.entity';
import { UserInterest } from 'src/modules/database/models/usersInterests.entity';
import { UserPreference } from 'src/modules/database/models/usersPreferences.entity';
import { UserReportedReview } from 'src/modules/database/models/usersReportedReviews.entity';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';
import { Wishlist } from 'src/modules/database/models/wishlists.entity';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getManager,
  getRepository,
  In,
  IsNull,
  Not,
  SelectQueryBuilder
} from 'typeorm';
import { UpdateUser } from '../validators/users/update';

const allUserData: (keyof User)[] = [
  'id',
  'email',
  'password',
  'name',
  'status',
  'description',
  'friendlyName',
  'gender',
  'birthDate',
  'sexualOrientation',
  'maritalStatus',
  'languages',
  'country',
  'state',
  'city',
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
  'lat',
  'lon',
  'sendNotifications',
  'emailConfirmationToken',
  'emailConfirmed',
  'phoneNumber',
];

const allUserPublicData: (keyof User)[] = [
  'id',
  'name',
  'status',
  'description',
  'friendlyName',
  'gender',
  'birthDate',
  'sexualOrientation',
  'maritalStatus',
  'languages',
  'country',
  'state',
  'city',
  'lat',
  'lon',
  'profilePhoto',
  'inviteCode',
  'roles',
  'relationshipId',
  'termId',
  'referralId',
  'createdAt',
  'sendNotifications',
  'emailConfirmed'
];
@Injectable()
export class UsersRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<User>
  ): Promise<Pagination<User>> {
    return paginate<User>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async findUserByEmailAndToken(token: string, email: string): Promise<User> {
    return User.findOne(
      {
        email,
        rememberToken: token
      },
      {
        select: ['id', 'email', 'password', 'name', 'status', 'roles', 'appleId', 'googleId', 'facebookId']
      }
    );
  }
  public async findByEmail(email: string): Promise<User> {
    return User.findOne(
      {
        email
      },
      {
        select: [
          'id',
          'email',
          'password',
          'name',
          'status',
          'profilePhoto',
          'roles',
          'appleId',
          'googleId',
          'facebookId',
          'emailConfirmed',
        ]
      }
    );
  }

  public async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return User.findOne(
      {
        phoneNumber
      },
      {
        select: [
          'id',
          'email',
          'password',
          'name',
          'status',
          'profilePhoto',
          'roles',
          'appleId',
          'googleId',
          'facebookId',
          'emailConfirmed',
        ]
      }
    );
  }

  public async findByEmailWithConfirmationToken(email: string): Promise<User> {
    return User.findOne(
      {
        email
      },
      {
        select: [
          'id',
          'email',
          'name',
          'status',
          'roles',
          'emailConfirmed',
          'emailConfirmationToken',
        ]
      }
    );
  }

  public async findByEmails(emails: Array<string>): Promise<User[]> {
    return User.find({
      where: {
        email: In(emails)
      },
      select: ['email']
    });
  }

  public calcPinguimPercent(pinguimInterest: Interest[], myInterests = []) {
    if (!pinguimInterest || !myInterests) return 0;
    
    if (pinguimInterest?.length <= 0 || myInterests?.length <= 0) {
      return 0;
    }
    
    const pinguimIds = pinguimInterest.map(item => item.id);
    const userIds = myInterests.map(item => item.id);

    if (userIds?.length <= 0) {
      return 0;
    }

    let count = 0;
    pinguimIds.forEach(item => {
      if (userIds.includes(item)) {
        count += 1;
      }
    });

    const result = (count * 100) / userIds?.length;

    return Math.floor(result);
  }

  public async listQueryBuilder(
    paginationOptions: IPaginationOptions,
    queryBuilder: SelectQueryBuilder<User>,
    myInterests?: Interest[]
  ): Promise<IPagination.IPaginated<User>> {
    const limit = Number(paginationOptions.limit) || 10;
    const offset = (Number(paginationOptions.page) - 1) * limit;

    const result = await queryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();
    
    const totalResults = await queryBuilder.clone().getCount();

    const paginated = {
      items: result,
      meta: {
        itemCount: limit,
        totalItems: totalResults,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalResults / limit),
        currentPage: Number(paginationOptions.page),
      },
    };

    if (myInterests) {
      const resultWithInterests = await Promise.all(result.map(async (data) => {
        const foundInterests = await UserInterest.find({
          relations: ['interest'],
          where: {
            userId: data.id,
          },
        });

        data.interests = foundInterests.map(userInterest => userInterest.interest);
        
        return data;
      }));

      paginated.items = resultWithInterests;

      paginated.items?.map((user, index) => {
        paginated.items[index].tripperPercent = this.calcPinguimPercent(user.interests as Interest[], myInterests);
      });
    }

    return paginated;
  }

  public async list(paginationOptions: IPaginationOptions, options?: FindManyOptions<User>): Promise<Pagination<User>> {
    return paginate<User>(
      getRepository(User),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options
      }
    );
  }

  public async insert(model: User): Promise<User> {
    return User.save(model);
  }

  public async findOneWithOptions(id: number, options: FindOneOptions<User>): Promise<User> {
    return User.findOne(id, {
      select: ['id', 'email', 'roles', 'profilePhoto', 'status', 'tokenOneSignal'],
      ...options
    });
  }

  public async findOne(where: FindConditions<User>): Promise<User> {
    return User.findOne({
      select: ['id', 'name', 'email', 'roles', 'profilePhoto', 'status', 'tokenOneSignal', 'sendNotifications'],
      where
    });
  }

  public async findById(id: number, myInterests?: Interest[]): Promise<User> {
    try {
      const user = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId: id })
        .andWhere('user.status = true')
        .select(allUserPublicData.map(value => `user.${value}`))
        .leftJoinAndSelect('user.interests', 'userInterest')
        .leftJoinAndSelect('user.term', 'userTerm')
        .leftJoinAndSelect('user.preferences', 'userPreferences')
        .leftJoinAndSelect('user.relationship', 'userRelationship')
        .getOne();
      // const user = await User.findOne(id, {
      //   select: allUserPublicData,
      //   relations: ['term', 'relationship', 'interests', 'preferences']
      // });
      if (!user) throw new NotFoundException('user-not-found');

      if (!myInterests) return user;

      return {
        ...user,
        tripperPercent: this.calcPinguimPercent(user?.interests as Interest[], myInterests)
      } as User;
    } catch (error) {
      if (error.message) throw error;

      throw new BadRequestException('find-user-failed');
    }
  }

  public async findByIds(ids: number[], myInterests?: Interest[], idUserLogged?: number): Promise<User[]> {
    try {
      const users = await getRepository(User)
        .createQueryBuilder('user')
        .select(allUserPublicData.map(value => `user.${value}`))
        .leftJoinAndSelect('user.interests', 'userInterest')
        .leftJoinAndSelect('user.term', 'userTerm')
        .leftJoinAndSelect('user.preferences', 'userPreferences')
        .leftJoinAndSelect('user.relationship', 'userRelationship')
        .where('user.id IN (:...ids)', { ids })
        .andWhere('user.status = true')
        .getMany();

      if (!users) throw new NotFoundException('user-not-found');

      if (!myInterests) return users;

      const result = users.map(user => ({
        ...user,
        tripperPercent: this.calcPinguimPercent(user?.interests as Interest[], myInterests)
      }));

      return result as User[];
    } catch (error) {
      if (error.message) throw error;

      throw new BadRequestException('find-user-failed');
    }
  }

  public async findByIdAllData(id: number, withRelations?: boolean): Promise<User> {
    if (withRelations) {
      return getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId: id })
        .andWhere('user.status = true')
        .select(allUserData.map(value => `user.${value}`))
        .leftJoinAndSelect('user.interests', 'userInterest')
        .leftJoinAndSelect('user.term', 'userTerm')
        .leftJoinAndSelect('user.preferences', 'userPreferences')
        .leftJoinAndSelect('user.relationship', 'userRelationship')
        .getOne();
    } else {
      return getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId: id })
        .andWhere('user.status = true')
        .select(allUserData.map(value => `user.${value}`))
        .getOne();
    }
  }

  public async findByIdWithPass(id: number): Promise<User> {
    return User.findOne(id, {
      select: [
        'id',
        'email',
        'password',
        'name',
        'status',
        'profilePhoto',
        'roles',
        'appleId',
        'googleId',
        'facebookId'
      ]
    });
  }

  public async update(model: User | CreateUsers | UpdateUser): Promise<User> {
    return User.save(model as User);
  }

  public async updateInterests(userId: number, interestsId: number[], needReturn = false): Promise<void | Interest[]> {
    try {
      await UserInterest.delete({ userId });

      const newInterests = interestsId.map(interestId => ({
        userId,
        interestId,
        status: true
      }));

      await UserInterest.insert(newInterests);

      if (needReturn) {
        return Interest.find({
          where: {
            id: In(interestsId)
          }
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error, 'update-interests-failed');
    }
  }

  public async updatePreferences(userId: number, preferencesId: number[]): Promise<void> {
    try {
      await UserPreference.delete({ userId });

      const newPreferences = preferencesId.map(preferenceId => ({ value: 1, userId, preferenceId } as UserPreference));

      await UserPreference.insert(newPreferences);
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error, 'update-preferences-failed');
    }
  }

  public async findByFacebookIdOrEmail(facebookId: string, email?: string): Promise<User> {
    return User.findOne({
      where: [
        {
          facebookId
        },
        {
          email
        }
      ],
      select: [
        'id',
        'email',
        'password',
        'name',
        'status',
        'profilePhoto',
        'roles',
        'appleId',
        'googleId',
        'facebookId'
      ]
    });
  }

  public async findByGoogleIdOrEmail(googleId: string, email?: string): Promise<User> {
    return User.findOne({
      where: [
        {
          googleId
        },
        {
          email
        }
      ],
      select: [
        'id',
        'email',
        'password',
        'name',
        'status',
        'profilePhoto',
        'roles',
        'appleId',
        'googleId',
        'facebookId'
      ]
    });
  }

  public async findByAppleIdOrEmail(appleId: string, email?: string): Promise<User> {
    return User.findOne({
      where: [
        {
          appleId
        },
        {
          email
        }
      ],
      select: [
        'id',
        'email',
        'password',
        'name',
        'status',
        'profilePhoto',
        'roles',
        'appleId',
        'googleId',
        'facebookId'
      ]
    });
  }

  public async listSortedBy(
    column: string,
    data: any[],
    paginationOptions: IPaginationOptions,
    userLoggerId: number,
    rand: number,
    myInterests?: Interest[]
  ): Promise<Pagination<User>> {
    const queryBuilder = await getRepository(User)
      .createQueryBuilder('users')
      .distinct(true)
      .select([
        'users.id',
        'users.name',
        'users.description',
        'users.birthDate',
        'users.friendlyName',
        'users.profilePhoto',
        'users.city',
        'users.state',
        'users.gender',
        'users.createdAt',
        'users.sendNotifications'
      ])
      .leftJoinAndSelect('users.interests', 'usersInterests')
      .where('users.id != :id', { id: userLoggerId })
      .andWhere('users.roles != :role', {
        role: 'admin'
      })
      .andWhere('users.roles != :role', {
        role: 'sysAdmin'
      })
      .andWhere('users.status = true')
      .orderBy(
        Array.isArray(data) && data.length > 0
          ? `IF(FIELD(${column},${data.toString()})=0,1,0),FIELD(${column},${data.toString()})`
          : `RAND(${rand})`
      );
    return this.listQueryBuilder(
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      queryBuilder,
      myInterests
    );
  }

  public async deleteAllData(user: User) {
    return getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.update(
        UserInterest,
        { userId: user.id },
        {
          status: false,
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        UserPreference,
        { userId: user.id },
        {
          value: 0,
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        UserReview,
        { userId: user.id },
        {
          status: false,
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        Wishlist,
        { userId: user.id },
        {
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        UserReportedReview,
        { userId: user.id },
        {
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        Feed,
        { userId: user.id },
        {
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        FeedComment,
        { userId: user.id },
        {
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.update(
        FeedLike,
        { userId: user.id },
        {
          deletedAt: new Date()
        }
      );

      await transactionalEntityManager.delete(RefreshToken, { userId: user.id });

      await transactionalEntityManager.update(User, user.id, {
        status: false,
        deletedAt: new Date(),
        email: `${user.id}_${user.email}`,
        appleId: `${user.id}_${user.appleId}`,
        googleId: `${user.id}_${user.googleId}`,
        facebookId: `${user.id}_${user.facebookId}`,
        chatId: `${user.id}_${user.chatId}`
      });

      // Delete follows and followers
      await transactionalEntityManager.softDelete(Follow, { followerId: user.id });
      await transactionalEntityManager.softDelete(Follow, { followedId: user.id });
    });
  }

  public async findByCommonInterests(user: User, paginationOptions: IPagination.IPaginationOptions): Promise<IPagination.IPaginated<User>> {
    const interestsId: Number[] = user.interests?.map(interest => (interest.id ? interest.id : interest)) || [];

    const usersWithInterestsQuery = UserInterest.createQueryBuilder('userInterests')
      .innerJoin('userInterests.user', 'user')
      .where({
        interestId: interestsId.length ? In(interestsId) : Not(IsNull()),
        userId: Not(user.id)
      })
      .andWhere((qb) => {
        // filter followed users
        const subQuery = qb.subQuery()
          .select('follow.followedId')
          .from(Follow, 'follow')
          .where(`follow.followerId = ${user.id}`)
          .getQuery();

        return `userInterests.userId not in (${subQuery})`;
      })
      .groupBy('userInterests.userId')
      .orderBy('RAND()');

    const usersWithInterests = await usersWithInterestsQuery.limit(paginationOptions.limit).getMany();

    const usersIds = usersWithInterests?.map(userInterest => userInterest.userId);
    const usersData = await this.findByIds(usersIds, user.interests as Interest[], user.id);

    return {
      items: usersData,
      meta: {
        itemCount: usersData.length,
        totalItems: (paginationOptions.page + 1) * paginationOptions.limit, // Fake to use RAND() ad infinitum
        itemsPerPage: paginationOptions.limit,
        totalPages: paginationOptions.page + 1, // Fake to use RAND() ad infinitum
        currentPage: paginationOptions.page,
      },
    };
  }
}
