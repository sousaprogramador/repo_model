import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AggregatedNotifications } from 'src/modules/database/models/aggregatedNotifications.entity';
import { FeedComment } from 'src/modules/database/models/feedComments.entity';
import { Notifications } from 'src/modules/database/models/notifications.entity';
import { getConnection } from 'typeorm';
import { AggredgatedNotificationsRepository } from '../repositories/aggregatedNotifications';
import { CreateNotifications } from '../validators/notifications/save';

@Injectable()
export class AggredgatedNotificationsService {
  logger: Logger;
  constructor(private aggredgatedNotificationsRepository: AggredgatedNotificationsRepository) {
    this.logger = new Logger('AggredgatedNotificationsService');
  }

  public async create(model: CreateNotifications): Promise<AggregatedNotifications> {
    const connection = getConnection();
    const transaction = connection.createQueryRunner();

    try {
      await transaction.connect();

      await transaction.startTransaction();

      const aggredgatedNotificationCreate = await transaction.manager.save(AggregatedNotifications, model);

      await transaction.commitTransaction();

      return aggredgatedNotificationCreate;
    } catch (error) {
      this.logger.error('Erro ao tentar criar notificação agregada', error);
      await transaction.rollbackTransaction();

      if (!error.message) throw new InternalServerErrorException('internal-server-error');

      throw error;
    } finally {
      await transaction.release();
    }
  }

  public async findOrCreateByTypeAndFeedId(
    type: string,
    feedId: number,
    notification: Notifications
  ): Promise<AggregatedNotifications> {
    const connection = getConnection();
    const transaction = connection.createQueryRunner();

    try {
      await transaction.connect();
      await transaction.startTransaction();

      const aggredgatedNotification = await transaction.manager.findOne(AggregatedNotifications, {
        where: {
          type,
          originFeedId: feedId
        }
      });

      if (aggredgatedNotification) {
        await transaction.commitTransaction();
        if (notification) {
          await this.aggredgatedNotificationsRepository.update({
            ...aggredgatedNotification,
            lastStatus: 'unread'
          } as AggregatedNotifications);
        }
        return aggredgatedNotification;
      }

      const newAggredgatedNotification = new AggregatedNotifications();
      newAggredgatedNotification.type = type;
      newAggredgatedNotification.originFeedId = feedId;
      newAggredgatedNotification.lastStatus = 'unread';
      newAggredgatedNotification.userId = notification.userId;

      const createdAggredgatedNotification = await transaction.manager.save(
        AggregatedNotifications,
        newAggredgatedNotification
      );

      if (createdAggredgatedNotification) {
        await transaction.commitTransaction();
        return createdAggredgatedNotification;
      }
    } catch (error) {
      this.logger.error('Erro ao tentar criar notificação agregada', error);
      await transaction.rollbackTransaction();

      if (!error.message) throw new InternalServerErrorException('internal-server-error');

      throw error;
    } finally {
      await transaction.release();
    }
  }
}
