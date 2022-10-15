import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { Chance } from 'chance';
import * as crypto from 'crypto';
import { createPaginationObject, IPaginationMeta, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { AwsService } from 'src/modules/common/services/aws';
import { IPaginated } from 'src/modules/common/services/pagination';
import { Feed } from 'src/modules/database/models/feeds.entity';
import { Follow } from 'src/modules/database/models/follows.entity';
import { Interest } from 'src/modules/database/models/interests.entity';
import { OperationToken } from 'src/modules/database/models/operationTokens.entity';
import { Relationship } from 'src/modules/database/models/relationships.entity';
import { Term } from 'src/modules/database/models/terms.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { APPLE_ID_KEYS_URL, FACEBOOK_OAUTH_URL, FRONT_WEB_URL, API_URL, FEATFLAGS } from 'src/settings';
import { JWKS, JWT } from 'ts-jose';
import { FindConditions, FindOneOptions, getConnection, getRepository, In, IsNull, Not } from 'typeorm';
import { User } from '../../database/models/users.entity';
import { FeedRepository } from '../repositories/feeds';
import { FollowsRepository } from '../repositories/follows';
import { AvaliationsRepository } from '../repositories/avaliations';
import { NotificationsRepository } from '../repositories/notifications';
import { UsersRepository } from '../repositories/users';
import { PaginationQuery } from '../validators/common/paginationQuery';
import { ListSearchUsers, ListUsers } from '../validators/users/get';
import { AppleLogin } from '../validators/users/login';
import { CreateUsers } from '../validators/users/save';
import { ChangePass, UpdateUser } from '../validators/users/update';
import { FeedService } from './feeds';
import { NotificationsService } from './notifications';
import { OneSignalService } from './oneSignal';
import { UserReviewService } from './userReview';

@Injectable()
export class UsersService {
  logger: Logger;
  constructor(
    private usersRepository: UsersRepository,
    private awsService: AwsService,
    private usersReviewsService: UserReviewService,
    private feedsService: FeedService,
    private feedRepository: FeedRepository,
    private mailService: MailService,
    private jwtService: JwtService, // private rdstationService: RDStationService
    private followsRepository: FollowsRepository,
    private avaliationsRepository: AvaliationsRepository,
    private notificationsService: NotificationsService,
    private oneSignalService: OneSignalService
  ) {
    this.logger = new Logger('UsersService');
  }

  public async deleteAccountRequest(user: Partial<User>): Promise<void> {
    try {
      const userToDelete = await this.usersRepository.findByIdAllData(user.id);

      if (!userToDelete) throw new NotFoundException('user-not-found');

      const tokenPayload = {
        id: user.id,
        email: user.email,
        createadAt: new Date()
      };

      const token = this.jwtService.sign(tokenPayload, {
        expiresIn: dayjs().add(30, 'day').unix()
      });

      const operationToken = await OperationToken.save({
        userId: userToDelete.id,
        operation: 'delete',
        token
      } as OperationToken);

      if (!operationToken) throw new BadRequestException('operation-token-not-created');

      this.logger.log(`Token de exclusão para o usuário ${userToDelete.id}: ${operationToken.token}`);

      const url = `${FRONT_WEB_URL}/exclusao-de-usuario-nest/?t=${operationToken.token}`;

      await this.mailService.sendAccountDeletionConfirmationRequest(userToDelete, url);
    } catch (e) {
      this.logger.error(e);

      if (!e.message) throw new BadRequestException('delete-account-error');

      throw e;
    }
  }

  public async refreshTokenOneSignal(tokenOneSignal, userId): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException('user-not-found');

    user.tokenOneSignal = tokenOneSignal;

    try {
      await this.updateProfile(
        {
          id: user.id,
          tokenOneSignal
        } as UpdateUser,
        user
      );

      return user;
    } catch (error) {
      throw new BadRequestException('onesignal-token-update-error');
    }
  }

  public async deleteAllUserData(token: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(token);

      const { id } = this.jwtService.decode(token) as Partial<User>;

      const operationToken = await OperationToken.findOne({
        token
      });

      if (!id || id != operationToken.userId) throw new UnauthorizedException('invalid-token');

      if (operationToken.operation !== 'delete') throw new UnauthorizedException('invalid-token');

      const user = await this.usersRepository.findById(operationToken.userId);

      if (!user) throw new NotFoundException('user-not-found');

      await this.usersRepository.deleteAllData(user);
    } catch (e) {
      this.logger.error(e);

      if (e.name === 'TokenExpiredError') throw new UnauthorizedException('token-expired');

      if (e.name === 'JsonWebTokenError') throw new UnauthorizedException('invalid-token');

      if (!e.message) throw new BadRequestException('delete-all-user-data-failed');

      throw e;
    }
  }

  isMissingData(user: User): boolean {
    return Boolean(
      !user.name ||
        !user.email ||
        !user.description ||
        !user.birthDate ||
        !user.country ||
        !user.state ||
        !user.city ||
        !user.profilePhoto ||
        !user.gender ||
        !user.maritalStatus ||
        !user.languages ||
        user.languages.length === 0 ||
        !user.interests ||
        user.interests.length === 0
    );
  }

  public async listFeeds(userId: number, query: PaginationQuery): Promise<IPaginated<Feed>> {
    const paginationOptions = { page: query.page || 1, limit: query.limit || 10 };

    try {
      const user = await this.findById(userId);

      if (!user) throw new NotFoundException('user-not-found');

      const result = await this.feedRepository.listUserFeed(user, paginationOptions);

      return result;
    } catch (e) {
      this.logger.error(e);

      if (!e.message) throw new BadRequestException('user-list-feed-failed');

      throw e;
    }
  }

  public async list(params: ListSearchUsers, user: Partial<User>): Promise<Pagination<User, IPaginationMeta>> {
    try {
      const userLogged = await this.findById(user.id);

      const { page, limit, rand, ...rest } = params;

      const random = `RAND(${rand || Math.floor(Math.random() * 10000)})`;

      const myInterests = userLogged.interests;

      const queryBuilder = getRepository(User)
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
          'users.createdAt'
        ])
        .where('users.id != :id', { id: user.id })
        .andWhere('users.roles NOT IN (:role)', {
          role: ['admin', 'sysAdmin']
        })
        .andWhere('users.status = true');

      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      } as IPaginationOptions;

      if (rest.gender && rest.gender !== '') {
        queryBuilder.andWhere('users.gender = :userGender', { userGender: rest.gender });
      }

      if (rest.destinationId) {
        queryBuilder
          .leftJoinAndSelect('users.wishlists', 'wishlists')
          .andWhere('wishlists.destinationId = :destinationId', { destinationId: rest.destinationId });
      }

      if (rest.ageFrom && rest.ageTo) {
        queryBuilder.andWhere(`users.birthDate BETWEEN :ageFrom AND :ageTo`, {
          ageFrom: rest.ageFrom,
          ageTo: rest.ageTo
        });
      }

      if (rest.interests && Array.isArray(rest.interests) && rest.interests.length > 0) {
        queryBuilder
          .leftJoinAndSelect('users.interests', 'usersInterests')
          .andWhere(`usersInterests.id IN (:interests)`, { interests: rest.interests.toString() })
          .getMany();
      } else if (rest.interests && typeof rest.interests === 'string' && rest.interests !== '') {
        queryBuilder
          .leftJoinAndSelect('users.interests', 'usersInterests')
          .andWhere(`usersInterests.id IN (:interests)`, { interests: rest.interests })
          .getMany();
      }

      if (rest.preferences && Array.isArray(rest.preferences) && rest.preferences.length > 0) {
        const chance = new Chance(rand);
        const preferences = chance.shuffle(rest.preferences);
        queryBuilder
          .leftJoinAndSelect('users.preferences', 'usersPreferences')
          .andWhere(`usersInterests.id IN (:preferences)`, { preferences: preferences.toString() })
          .getMany();
      } else if (rest.preferences && typeof rest.preferences === 'string' && rest.preferences !== '') {
        const chance = new Chance(rand);
        const preferences = chance.shuffle(rest.preferences.split(','));
        queryBuilder
          .leftJoinAndSelect('users.preferences', 'usersPreferences')
          .andWhere(`userspreferences.id IN (:preferences)`, { preferences: preferences })
          .getMany();
      }

      // Usando latitude, longitude e raio para filtrar usuários
      if (rest.distance) {
        let latitude = null;
        let longitude = null;

        if (rest.lat && rest.lon) {
          latitude = rest.lat;
          longitude = rest.lon;
        } else {
          if (userLogged.lat && userLogged.lon) {
            latitude = userLogged.lat;
            longitude = userLogged.lon;
          }
        }

        if (latitude !== null && longitude !== null) {
          queryBuilder.andWhere(
            `(6371 * acos(cos(radians(${latitude})) * cos(radians(users.lat)) * cos(radians(users.lon) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(users.lat)))) < ${rest.distance}`
          );
        }
      }

      if (rest.search && rest.search !== '') {
        queryBuilder.andWhere(`users.name LIKE :search`, { search: `%${rest.search}%` });

        return this.usersRepository.listQueryBuilder(paginationOption, queryBuilder);
      }

      queryBuilder.orderBy(random);

      const foundUsers = await this.usersRepository.listQueryBuilder(
        paginationOption,
        queryBuilder,
        myInterests as Interest[]
      );

      const resultItems = await Promise.all(
        foundUsers.items.map(async user => {
          user.followData = await this.followsRepository.followNumbers(user.id);

          const followInfo = await this.followsRepository.followInfo(userLogged.id, user.id);
          user.followMe = followInfo.isFollower;
          user.imFollowing = followInfo.imFollowing;

          return user;
        })
      );
      foundUsers.items = resultItems;

      return foundUsers;
    } catch (e) {
      this.logger.error('Error list UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async listMedia(userId: number, query: PaginationQuery) {
    try {
      const { page, limit } = query;

      const pagination = {
        page: page || 1,
        limit: limit || 10
      };

      const user = await this.usersRepository.findById(userId);

      if (!user) throw new NotFoundException('user-not-found');

      const reviewsMedia = await this.usersReviewsService.findImagesByUserId(user.id);

      const feedMedia = await this.feedsService.findImagesByUserId(user.id);

      const media = [...reviewsMedia, ...feedMedia];

      return createPaginationObject({
        items: media.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit),
        currentPage: pagination.page,
        limit: pagination.limit,
        totalItems: media.length
      });
    } catch (e) {
      this.logger.error(e);
      if (!e.message) throw new BadRequestException('media-list-failed');

      throw e;
    }
  }

  public async findUserByEmailAndToken(email: string, token: string): Promise<User> {
    try {
      const user = await this.usersRepository.findUserByEmailAndToken(token, email);

      if (!user) throw new BadRequestException('user-not-found');

      return user;
    } catch (e) {
      this.logger.error('Error findUserByEmailAndToken UsersService: ', e);
      if (!e.message) throw new BadRequestException('find-user-by-email-and-token-error');
      throw e;
    }
  }

  public async getConfirmationToken(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findByEmailWithConfirmationToken(email);

      if (!user) throw new BadRequestException('user-not-found');

      return user;
    } catch (e) {
      this.logger.error('Error findUserByEmailAndToken UsersService: ', e);
      if (!e.message) throw new BadRequestException('find-user-by-email-and-token-error');
      throw e;
    }
  }

  public async checkByPhoneNumber(phoneNumber: string): Promise<any> {
    if (!phoneNumber) throw new BadRequestException('where-is-the-phone-number');

    const user = await this.findUserByPhoneNumber(phoneNumber);

    return { isValid: user ? true : false, name: user ? user.name : null };
  }

  public async checkByEmail(email: string): Promise<any> {
    if (!email) throw new BadRequestException('where-is-the-email');

    const user = await this.findUserByEmail(email);

    return { isValid: user ? true : false, name: user ? user.name : null };
  }

  public async findUserByPhoneNumber(phoneNumber: string) {
    try {
      if (!phoneNumber) return null;

      return this.usersRepository.findByPhoneNumber(phoneNumber);
    } catch (e) {
      this.logger.error(e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async findUserByEmail(email: string) {
    try {
      if (!email) return null;

      return this.usersRepository.findByEmail(email);
    } catch (e) {
      this.logger.error(e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async findUsersByEmail(emails: Array<string>) {
    try {
      if (!emails) return null;

      return this.usersRepository.findByEmails(emails);
    } catch (e) {
      this.logger.error(e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async changePass(model: ChangePass, user: Partial<User>): Promise<User> {
    try {
      const { confirmNewPassword, newPassword, oldPassword } = model;

      const { id } = user;

      const userToUpdate = await this.usersRepository.findByIdWithPass(id);

      if (!userToUpdate) throw new UnauthorizedException('user-not-found');

      const isValid = await bcrypt.compare(oldPassword, userToUpdate.password);

      if (!isValid) throw new UnauthorizedException('wrong-password');

      if (newPassword !== confirmNewPassword) throw new UnauthorizedException('passwords-do-not-match');

      userToUpdate.password = await this.hashPassword(newPassword);

      await userToUpdate.save();

      delete userToUpdate.password;
      return userToUpdate;
    } catch (e) {
      this.logger.error('Error changePass UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async signup(data: CreateUsers): Promise<User> {
    try {
      const user = await this.usersRepository.findByEmail(data.email);

      if (user) {
        // if ((user.emailConfirmed === 'NOT_CONFIRMED') && FEATFLAGS.LOGIN_NEEDS_EMAIL_CONFIRMATION) {
        //   throw new UnauthorizedException('email-not-valited');
        // }

        throw new UnauthorizedException('email-already-registered');
      }

      data.roles = 'user';

      if (data.languages) {
        data.languages = data.languages.toString() as string;
      }

      const createdUser = await this.create(data);
      // if (FEATFLAGS.LOGIN_NEEDS_EMAIL_CONFIRMATION) {
      await this.mailService.sendUserConfirmation(
        createdUser,
        createdUser.emailConfirmationToken,
        `${API_URL}/app/auth/confirm-email?email=${createdUser.email}&token=${createdUser.emailConfirmationToken}`
      );
      // }

      delete createdUser.emailConfirmationToken;

      return createdUser;
    } catch (e) {
      this.logger.error('Error signup UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async save(model: CreateUsers): Promise<User> {
    try {
      if (model.languages) {
        model.languages = model.languages.toString() as string;
      }

      if (model.id) return this.update(model);

      const user = await this.usersRepository.findByEmail(model.email);

      if (user) throw new UnauthorizedException('email-already-registered');

      return this.create(model);
    } catch (e) {
      this.logger.error('Error save UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  private async create(model: CreateUsers): Promise<User> {
    // Criação da transaction
    const connection = await getConnection();
    const transaction = connection.createQueryRunner();

    if (model.inviteCode) delete model.inviteCode;

    try {
      // AccessToken
      const accessToken = model.accessToken;
      delete model.accessToken;

      const facebookId = model.facebookId;

      if (facebookId && accessToken) {
        const facebookData = await this.getFacebookUserData(accessToken);

        model.name = facebookData.name;
        model.email = facebookData.email;
        model.facebookId = facebookData.facebookId;
        model.profilePhoto = model.profilePhoto ? model.profilePhoto : facebookData.profilePhoto;
      }

      // FacebookId
      // GoogleId

      let interestsId: number[] = [];
      let preferencesId: number[] = [];

      if (model.interests) {
        interestsId = model.interests.map<number>(interest => {
          if (interest.id) return interest.id;

          return interest;
        });
        delete model.interests;
      }

      if (model.preferences) {
        preferencesId = model.preferences.map<number>(preference => {
          if (preference.id) return preference.id;

          return preference;
        });
        delete model.preferences;
      }

      await transaction.connect();
      await transaction.startTransaction();

      model.password = model.password ? await this.hashPassword(model.password) : null;

      const hasUserEmail = await transaction.manager.count(User, {
        email: model.email
      });

      if (hasUserEmail) {
        await transaction.rollbackTransaction();
        throw new UnauthorizedException('email-already-registered');
      }

      if (model.referralId) {
        // Usuario Referencia
        const userReferral = await transaction.manager.count(User, {
          id: model.referralId
        });

        if (!userReferral) {
          console.log('Usuário referência não encontrado');
          model.referralId = null;
        }
      }
      if (model.relationshipId) {
        const relationship = await transaction.manager.count(Relationship, {
          id: model.relationshipId
        });

        if (!relationship) {
          console.log('Relationship não encontrado');
          model.relationshipId = null;
        }
      }
      if (model.termId) {
        const term = await transaction.manager.count(Term, {
          id: model.termId
        });

        if (!term) {
          console.log('Term referência não encontrado');
          model.termId = null;
        }
      }

      // Generate email confirmation token
      model.emailConfirmationToken = crypto.randomBytes(3).toString('hex').toUpperCase();

      const userCreated = await transaction.manager.save(User, model);

      // const interestsCreated: Interest[] = [];

      if (userCreated) {
        const userInviteCode = this.generateInviteCode(userCreated);

        await transaction.manager.update(
          User,
          {
            id: userCreated.id
          },
          { inviteCode: userInviteCode }
        );

        await transaction.commitTransaction();
        delete userCreated.password;

        if (interestsId.length > 0) {
          await this.usersRepository.updateInterests(userCreated.id, interestsId);
        }

        if (preferencesId.length > 0) {
          await this.usersRepository.updatePreferences(userCreated.id, preferencesId);
        }

        return userCreated;
      } else {
        await transaction.rollbackTransaction();
        throw new BadRequestException('user-not-created');
      }

      // // RDSTATION
      // const RDLead = this.rdstationService.mountLeadData(userCreated, {
      //   conversion_identifier: 'API_NEST_SIGNUP',
      //   tags: interestsCreated.length > 0 ? interestsCreated.map(interest => interest.name) : [],
      //   available_for_mailing: true
      // });

      // await this.rdstationService
      //   .signUpLead(RDLead)
      //   .then(() => {
      //     this.logger.log('Lead adicionado ao RDSTATION');
      //   })
      //   .catch(e => {
      //     this.logger.error('erro ao salvar dados no RDSTATION', e);
      //   });
      // // RDSTATION;
    } catch (error) {
      this.logger.error('Erro ao tentar criar usuário', error);
      await transaction.rollbackTransaction();

      if (!error.message) throw new InternalServerErrorException('internal-server-error');

      throw error;
    } finally {
      await transaction.release();
    }
  }

  public async findOneWithOptions(id: number, options: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOneWithOptions(id, options);
  }

  public async findOne(where: FindConditions<User>) {
    try {
      const user = await this.usersRepository.findOne(where);

      if (!user) throw new NotFoundException('user-not-found');

      delete user.password;

      return user;
    } catch (e) {
      this.logger.error('Error findById UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async findById(userId: number, needAllData?: boolean, userLogged?: Partial<User>): Promise<User> {
    try {
      if (userLogged) {
        const userLoggedInfo = await this.findById(userLogged.id);

        const user = needAllData
          ? await this.usersRepository.findByIdAllData(userId, true)
          : await this.usersRepository.findById(userId, userLoggedInfo.interests as Interest[]);

        if (!user) throw new NotFoundException('user-not-found');

        delete user.password;

        // Seguidores
        const followInfo = await this.followsRepository.followInfo(userLogged.id, userId);
        user.followData = await this.followsRepository.followNumbers(userId);
        user.followMe = followInfo.isFollower;
        user.imFollowing = followInfo.imFollowing;

        // Avaliação
        const avaliationsInfo = await this.avaliationsRepository.userMeanRating(userId);
        user.avaliationsMean = avaliationsInfo.mean;
        user.avaliationsCount = avaliationsInfo.avaliations;

        return user;
      } else {
        const user = needAllData
          ? await this.usersRepository.findByIdAllData(userId, true)
          : await this.usersRepository.findById(userId);

        if (!user) throw new NotFoundException('user-not-found');

        delete user.password;

        // Seguidores
        user.followData = await this.followsRepository.followNumbers(userId);

        // Avaliação
        const avaliationsInfo = await this.avaliationsRepository.userMeanRating(userId);
        user.avaliationsMean = avaliationsInfo.mean;
        user.avaliationsCount = avaliationsInfo.avaliations;

        return user;
      }
    } catch (e) {
      this.logger.error('Error findById UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  private async update(model: CreateUsers | UpdateUser): Promise<User> {
    try {
      const user = await this.findById(model.id, true);

      if (!user) throw new NotFoundException('not-found');

      // Nao pode atualizar senha
      delete model.password;

      let interestsId: number[];
      let preferencesId: number[];

      let interestsCreated: Interest[] = [];

      if (model.interests) {
        interestsId = model.interests.map<number>(interest => {
          if (interest?.id) return interest.id;
          return interest;
        });

        delete model.interests;

        interestsCreated = (await this.usersRepository.updateInterests(user.id, interestsId, true)) as Interest[];
      }
      if (model.preferences) {
        preferencesId = model.preferences.map<number>(preference => {
          if (preference?.id) return preference.id;
          return preference;
        });

        delete model.preferences;
        await this.usersRepository.updatePreferences(user.id, preferencesId);
      }
      if (model.referralId) {
        // Usuario Referencia
        const userReferral = await User.count({
          id: model.referralId
        });

        if (!userReferral) {
          console.log('Usuário referência não encontrado');
          model.referralId = null;
        }
      }
      if (model.relationshipId) {
        const relationship = await Relationship.count({
          id: model.relationshipId
        });

        if (!relationship) {
          console.log('Relationship não encontrado');
          model.relationshipId = null;
        }
      }
      if (model.termId) {
        const term = await Term.count({
          id: model.termId
        });

        if (!term) {
          console.log('Term referência não encontrado');
          model.termId = null;
        }
      }

      await this.usersRepository.update(model);

      const userUpdated = await this.findById(model.id, true);
      // // RDSTATION
      // const RDLead = this.rdstationService.mountLeadData(userUpdated, {
      //   tags: interestsCreated.length > 0 ? interestsCreated.map(interest => interest.name.toLocaleLowerCase()) : []
      // });

      // await this.rdstationService
      //   .patchLeadInformations({
      //     data: RDLead,
      //     email: user.email
      //   })
      //   .then(() => {
      //     this.logger.log('Lead atualizado no RDSTATION');
      //   })
      //   .catch(e => {
      //     this.logger.error('erro ao atualizar dados no RDSTATION', e);
      //   });
      // // RDSTATION;

      return {
        ...userUpdated,
        isMissingData: this.isMissingData({
          ...userUpdated,
          email: user.email
        } as User)
      } as User;
    } catch (e) {
      this.logger.error('Error update UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public hashPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hash(password, 10);
    return hashedPassword;
  }

  public generateInviteCode(data: Partial<User>): string {
    const stringSecret = data.email + '|' + data.id;
    return crypto.createHash('md5').update(stringSecret).digest('hex');
  }

  public async uploadProfilePhoto(file: Express.Multer.File, userLogged?: Partial<User> | null) {
    try {
      const dir = 'users';
      const userId = userLogged ? userLogged.id : null;
      let user: User;

      if (userId) {
        user = await this.usersRepository.findById(userId);

        if (!user) throw new NotFoundException('user-not-found');
      }

      const fileUploaded = await this.awsService.uploadS3(file, dir);

      if (!fileUploaded) throw new BadRequestException('upload-failed');

      if (user) {
        await this.usersRepository.update({
          id: user.id,
          profilePhoto: fileUploaded.url
        } as User);
      }

      return fileUploaded;
    } catch (e) {
      this.logger.error('Error uploadProfilePhoto UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async findOrCreateByGoogleId(googleId: string, data: Partial<User>): Promise<User> {
    try {
      const user = await this.usersRepository.findByGoogleIdOrEmail(googleId, data.email);

      if (user) {
        if (!user.googleId) {
          await this.usersRepository.update({
            id: user.id,
            googleId: googleId
          } as User);
        }
        return user;
      }

      const userData = {
        ...data,
        name: data.name || '', // Nome do usuário
        roles: 'user',
        emailConfirmed: 'CONFIRMED'
      } as CreateUsers;

      return this.create(userData);
    } catch (e) {
      this.logger.error('Error findOrCreateByGoogleId UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async findOrCreateByFacebookData(accessToken?: string, facebookData?: Partial<User>): Promise<User> {
    try {
      const user = await this.usersRepository.findByFacebookIdOrEmail(facebookData.facebookId, facebookData.email);

      if (user) {
        if (!user.facebookId) {
          await this.usersRepository.update({
            id: user.id,
            facebookId: facebookData.facebookId
          } as User);
        }

        return user;
      }

      let newFacebookData: Partial<User> = facebookData;

      if (!facebookData) {
        newFacebookData = await this.getFacebookUserData(accessToken);
      }

      const userData = {
        ...newFacebookData,
        roles: 'user',
        emailConfirmed: 'CONFIRMED'
      } as CreateUsers;

      return this.create(userData);
    } catch (e) {
      this.logger.error('Error findOrCreateByFacebookId UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async findOrCreateByApple(model: AppleLogin): Promise<User> {
    try {
      const isAppleValid = await this.verifyAppleData(model.user, model.identityToken, model.email);
      if (!isAppleValid) {
        throw new UnauthorizedException('invalid-apple-token');
      }

      const user = await this.usersRepository.findByAppleIdOrEmail(model.user, model.email);
      if (user) {
        if (!user.appleId) {
          await this.usersRepository.update({
            id: user.id,
            appleId: model.user
          } as User);
        }

        return user;
      }

      const userData = {
        email: model.email,
        name: `${model.givenName} ${model.familyName}`,
        appleId: model.user,
        roles: 'user',
        emailConfirmed: 'CONFIRMED'
      } as CreateUsers;

      return this.create(userData);
    } catch (e) {
      this.logger.error('Error findOrCreateByApple UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async checkFacebookAccessToken(
    inputToken: string,
    appAccessToken: string,
    accessToken: string
  ): Promise<User> {
    try {
      const userData = await this.getFacebookUserData(accessToken);

      if (userData.facebookId) {
        return this.findOrCreateByFacebookData(accessToken, userData);
      } else {
        throw new BadRequestException('invalid-facebook-token');
      }
    } catch (e) {
      this.logger.error('Error checkFacebookAccessToken UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');

      throw e;
    }
  }

  private async getFacebookUserData(accessToken: string): Promise<Partial<User>> {
    try {
      const { data: facebookData } = await axios.get(`${FACEBOOK_OAUTH_URL}me`, {
        params: { fields: 'id,name,email', access_token: accessToken }
      });

      const user = {
        name: facebookData.name,
        email: facebookData.email,
        facebookId: facebookData.id,
        profilePhoto: `${FACEBOOK_OAUTH_URL}${facebookData.id}/picture?type=large&width=720&height=720`
      } as User;

      return user;
    } catch (error) {
      console.log('error', error.response.data);
      this.logger.error('error getFacebookUserData', error);
      throw new BadRequestException('invalid-facebook-token');
    }
  }

  private async verifyAppleData(appleId: string, identityToken: string, email?: string): Promise<boolean> {
    let appleKey;
    try {
      const { status, data } = await axios.get(APPLE_ID_KEYS_URL);

      if (status !== 200 || !data) {
        throw new InternalServerErrorException('cannot-access-apple-servers');
      }
      appleKey = data;
    } catch (error) {
      throw new InternalServerErrorException('cannot-access-apple-servers');
    }

    try {
      const key = await JWKS.fromObject(appleKey);
      const { sub, email: appleEmail } = await JWT.verify(identityToken, key);

      if (appleId !== sub || (email && email !== appleEmail)) {
        return false;
      }

      return true;
    } catch (e) {
      throw new UnauthorizedException('invalid-apple-token');
    }
  }

  public async updateProfile(model: UpdateUser, userLogged: Partial<User>): Promise<User> {
    try {
      const user = await this.usersRepository.findById(userLogged.id);

      if (!user) throw new NotFoundException('user-not-found');

      model.id = user.id;
      if (model.password) {
        delete model.password;
        // model.password = await this.hashPassword(model.password);
      }
      if (model.languages) {
        model.languages = model.languages.toString() as string;
      }

      return this.update(model);
    } catch (e) {
      this.logger.error('Error updateProfile UsersService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async usersByInterests(userLogged: Partial<User>, params: ListUsers): Promise<IPaginated<User>> {
    const paginationOptions = {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 10
    };

    try {
      const user = await this.usersRepository.findById(userLogged.id);
      if (!user) throw new NotFoundException('user-not-found');

      const result = await this.usersRepository.findByCommonInterests(user, paginationOptions);

      const resultItems = await Promise.all(
        result.items.map(async user => {
          user.followData = await this.followsRepository.followNumbers(user.id);

          const followInfo = await this.followsRepository.followInfo(userLogged.id, user.id);
          user.followMe = followInfo.isFollower;
          user.imFollowing = followInfo.imFollowing;

          return user;
        })
      );
      result.items = resultItems;

      return result;
    } catch (error) {
      console.log(error);
      this.logger.error('Error usersByInterests UsersService: ', error);
      if (!error.message) throw new BadRequestException('list-users-by-interests-failed');

      throw error;
    }
  }

  async resendConfirmation(email: string): Promise<void> {
    const foundUser = await this.usersRepository.findByEmail(email);
    if (!foundUser) return;
    if (foundUser.emailConfirmed !== 'NOT_CONFIRMED') throw new BadRequestException('email-already-confirmed');

    foundUser.emailConfirmationToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    delete foundUser.languages; // TODO resolve save for maps

    await foundUser.save();

    return this.mailService.sendUserConfirmation(
      foundUser,
      foundUser.emailConfirmationToken,
      `${API_URL}/app/auth/confirm-email?email=${foundUser.email}&token=${foundUser.emailConfirmationToken}`
    );
  }

  async follow(id: number, user: User): Promise<Follow> {
    if (Number(id) === user.id) throw new BadRequestException('error-follow-same-user');

    const newData = new Follow({
      followedId: id,
      followerId: user.id
    });

    const result = await this.followsRepository.upsert(newData);

    this.notificationsService.create({
      userId: id,
      type: 'follow',
      originUserId: user.id,
      status: 'unread'
    });

    const userOrigin = await this.usersRepository.findOne({ id: user.id });
    this.oneSignalService.sendNotification({
      userId: id,
      title: 'Novo seguidor',
      message: `${userOrigin.name} começou a te seguir`,
      data: {
        userId: user.id
      }
    });

    return result;
  }

  async unfollow(id: number, user: User): Promise<Follow> {
    const result = await this.followsRepository.delete(user.id, id);

    if (!result) {
      throw new NotFoundException('follow-not-found');
    }

    return result;
  }

  async getFollowers(id: number, user: User, pagination?: PaginationQuery): Promise<IPaginated<Follow>> {
    const numberId = Number(id);
    if (!numberId || numberId < 0) throw new BadRequestException('invalid-id');

    const result = await this.followsRepository.followers(numberId, user.id, pagination);
    return result;
  }

  async getFollows(id: number, user: User, pagination?: PaginationQuery): Promise<IPaginated<Follow>> {
    const numberId = Number(id);
    if (!numberId || numberId < 0) throw new BadRequestException('invalid-id');

    const result = await this.followsRepository.follows(numberId, user.id, pagination);
    return result;
  }

  async followConnections(searchId: number, user: User, pagination?: PaginationQuery): Promise<IPaginated<Follow>> {
    const result = await this.followsRepository.followedBy(user.id, searchId, pagination);
    return result;
  }
}
