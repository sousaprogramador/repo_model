import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { User } from '../../database/models/users.entity';
import { UsersRepository } from '../repositories/users';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { FindConditions, FindManyOptions, getConnection, Like } from 'typeorm';
import { CreateUsers } from '../validators/users/save';
import { Term } from 'src/modules/database/models/terms.entity';
import { Relationship } from 'src/modules/database/models/relationships.entity';
import { ChangePass } from '../validators/users/update';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { AwsService } from 'src/modules/common/services/aws';
import { ListUsers } from '../validators/users/get';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private awsService: AwsService) {}

  public async list(params: ListUsers) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<User>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<User>;
    if (rest.email) where.email = Like(`%${rest.email}%`);
    if (rest.name) where.name = Like(`%${rest.name}%`);

    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.usersRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.usersRepository.listAll(options);
  }

  public async findUserByEmailAndToken(email: string, token: string): Promise<User> {
    const user = await this.usersRepository.findUserByEmailAndToken(email, token);

    if (!user) throw new UnauthorizedException('user-not-found');

    return user;
  }
  public async findUserByEmail(email: string) {
    if (!email) return null;

    return this.usersRepository.findByEmail(email);
  }
  public async findOne(where: FindConditions<User>) {
    try {
      const user = await this.usersRepository.findOne(where);

      if (!user) throw new NotFoundException('user-not-found');

      delete user.password;

      return user;
    } catch (e) {
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }
  public async changePass(model: ChangePass, user: Partial<User>): Promise<User> {
    const { confirmNewPassword, newPassword, oldPassword } = model;

    const { id } = user;

    const userToUpdate = await this.usersRepository.findByIdWithPass(id);

    if (!userToUpdate) throw new UnauthorizedException('user-not-found');

    const isValid = await bcrypt.compare(oldPassword, userToUpdate.password);

    if (!isValid) throw new UnauthorizedException('wrong-password');

    if (newPassword !== confirmNewPassword) throw new UnauthorizedException('passwords-do-not-match');

    userToUpdate.password = await this.hashPassword(newPassword);

    await userToUpdate.save();

    return userToUpdate;
  }

  public async save(model: CreateUsers): Promise<User> {
    if (model.languages) {
      model.languages = model.languages.toString() as string;
    }
    const newModel = model as User;

    if (model.id) return this.update(newModel);

    const user = await this.usersRepository.findByEmail(model.email);

    if (user) throw new UnauthorizedException('email-already-registered');

    return this.create(newModel);
  }

  private async create(model: User): Promise<User> {
    // Criação da transaction
    const connection = await getConnection();
    const transaction = connection.createQueryRunner();

    try {
      let interestsId: number[] = [];
      let preferencesId: number[] = [];

      if (model.interests) {
        interestsId = model.interests.map<number>(interest => {
          if (interest?.id) return interest.id;

          return interest;
        });
        delete model.interests;
      }

      if (model.preferences) {
        preferencesId = model.preferences.map<number>(preference => {
          if (preference?.id) return preference.id;

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

      const userCreated = await transaction.manager.save(User, model);

      if (userCreated) {
        const userInviteCode = this.generateInviteCode(userCreated);

        await transaction.manager.update(
          User,
          {
            id: userCreated.id
          },
          { inviteCode: userInviteCode }
        );

        if (interestsId.length > 0) {
          await this.usersRepository.updateInterests(userCreated.id, interestsId);
        }
        if (preferencesId.length > 0) {
          await this.usersRepository.updatePreferences(userCreated.id, preferencesId);
        }
      }

      await transaction.commitTransaction();

      return userCreated;
    } catch (error) {
      console.log(error);
      await transaction.rollbackTransaction();
      throw error;
    } finally {
      await transaction.release();
    }
  }

  public async findById(stateId: number): Promise<User> {
    const state = await this.usersRepository.findById(stateId);
    if (!state) throw new NotFoundException('not-found');

    return state;
  }

  private async update(model: User): Promise<User> {
    const user = await this.usersRepository.findById(model.id);

    if (!user) throw new NotFoundException('not-found');

    // Nao pode atualizar senha
    delete model.password;

    let interestsId: number[] = [];
    let preferencesId: number[] = [];

    if (model.interests) {
      interestsId = model.interests.map<number>(interest => {
        if (interest?.id) return interest.id;

        return interest;
      });
      delete model.interests;
    }

    if (model.preferences) {
      preferencesId = model.preferences.map<number>(preference => {
        if (preference?.id) return preference.id;

        return preference;
      });
      delete model.preferences;
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

    if (interestsId.length >= 0) {
      await this.usersRepository.updateInterests(user.id, interestsId);
    }
    if (preferencesId.length >= 0) {
      await this.usersRepository.updatePreferences(user.id, preferencesId);
    }

    return this.usersRepository.update(model);
  }

  public async remove(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('user-not-found');
    }

    return this.usersRepository.remove(userId);
  }

  public async hashPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hash(password, 10);
    return hashedPassword;
  }

  public generateInviteCode(data: User): string {
    const stringSecret = data.email + '|' + data.id;
    return crypto.createHash('md5').update(stringSecret).digest('hex');
  }

  public async uploadProfilePhoto(file: Express.Multer.File, userId?: number | null) {
    try {
      const dir = 'users';

      let user;
      if (userId) {
        user = await this.usersRepository.findById(userId);
        if (!user) throw new NotFoundException('user-not-found');
      }
      const fileUploaded = await this.awsService.uploadS3(file, dir);

      if (!fileUploaded) throw new BadRequestException('upload-failed');

      if (user) {
        user.profilePhoto = fileUploaded.url;
        await user.save();
      }

      return fileUploaded;
    } catch (e) {
      console.error(e);
      throw new BadRequestException('upload-failed');
    }
  }
}
