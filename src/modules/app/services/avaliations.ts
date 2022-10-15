import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginated, IPaginationOptions } from 'src/modules/common/services/pagination';
import { Adjective } from 'src/modules/database/models/adjectives.entity';
import { Avaliation } from 'src/modules/database/models/avaliations.entity';
import { User } from 'src/modules/database/models/users.entity';
import { AvaliationsRepository } from '../repositories/avaliations';
import { UsersRepository } from '../repositories/users';
import { CreateAvaliation } from '../validators/avaliations/create';
import { NotificationsService } from './notifications';
import { OneSignalService } from './oneSignal';

@Injectable()
class AvaliationsService {
  constructor(
    private avaliationsRepository: AvaliationsRepository,
    private usersRepository: UsersRepository,
    private notificationsService: NotificationsService,
    private oneSignalService: OneSignalService
  ) {}

  public async create(data: CreateAvaliation, originUser: User): Promise<Avaliation> {
    const userToReview = await this.usersRepository.findById(data.userId);
    if (!userToReview) throw new NotFoundException('user-not-found');

    const newAvaliation = new Avaliation({ ...data, originUser });
    newAvaliation.user = userToReview;

    const avaliationAdjectives = await Adjective.findByIds(data.adjectives);
    newAvaliation.adjectives = avaliationAdjectives;

    const result = await this.avaliationsRepository.create(newAvaliation);

    if (!originUser.name) {
      originUser = await this.usersRepository.findOne({ id: originUser.id });
    }

    this.notificationsService.create({
      userId: data.userId,
      type: 'avaliation',
      originUserId: originUser.id,
      status: 'unread'
    });

    this.oneSignalService.sendNotification({
      userId: data.userId,
      title: 'Nova avaliação',
      message: `${originUser.name} avaliou o seu perfil`,
      data: {
        avaliationId: result.id
      }
    });

    return result;
  }

  public async read(id: number): Promise<Avaliation> {
    const foundAvaliation = await this.avaliationsRepository.read(id);
    if (!foundAvaliation) throw new NotFoundException('avaliation-not-found');

    return foundAvaliation;
  }

  public async list(
    user: User | number,
    paginationOptions: IPaginationOptions,
    order: 'ASC' | 'DESC' = 'DESC'
  ): Promise<IPaginated<Avaliation>> {
    const id = typeof user === 'number' ? user : user.id;

    if (!id) throw new BadRequestException('user-id');

    const foundAvaliations = await this.avaliationsRepository.getByUser(id, paginationOptions, order);
    return foundAvaliations;
  }

  public async getResume(id: number) {
    const result = await this.avaliationsRepository.userMeanRating(id);
    return result;
  }
}

export { AvaliationsService };
