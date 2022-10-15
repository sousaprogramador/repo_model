import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { AggregatedNotifications } from 'src/modules/database/models/aggregatedNotifications.entity';
import { Notifications } from 'src/modules/database/models/notifications.entity';
import { User } from 'src/modules/database/models/users.entity';
import { getConnection } from 'typeorm';
import { AggredgatedNotificationsRepository } from '../repositories/aggregatedNotifications';
import { ListUnreadNotifications } from '../validators/notifications/getUnreadsNotifications';
import { CreateNotifications } from '../validators/notifications/save';
import { AggredgatedNotificationsService } from './aggregatedNotifications';

@Injectable()
export class NotificationsService {
  logger: Logger;
  constructor(
    private aggregatedNotificationsRepository: AggredgatedNotificationsRepository,
    private aggregatedNotificationsService: AggredgatedNotificationsService
  ) {
    this.logger = new Logger('NotificationsService');
  }

  public async create(model: CreateNotifications): Promise<Notifications> {
    const connection = getConnection();
    const transaction = connection.createQueryRunner();

    try {
      await transaction.connect();
      await transaction.startTransaction();

      const notificationCreate = await transaction.manager.save(Notifications, model);

      if (notificationCreate) {
        await transaction.commitTransaction();

        const aggregatedNotification = await this.aggregatedNotificationsService.findOrCreateByTypeAndFeedId(
          model.type,
          model.feedId,
          notificationCreate
        );

        aggregatedNotification.lastUpdatedAtNotifications = notificationCreate.updatedAt;

        await this.aggregatedNotificationsRepository.update(aggregatedNotification);

        const updateNotificationWithIdAggregatedNotification = await Notifications.findOne(notificationCreate.id);

        updateNotificationWithIdAggregatedNotification.aggregatedNotificationId = aggregatedNotification.id;

        await transaction.manager.save(updateNotificationWithIdAggregatedNotification);

        if (notificationCreate.originUserId !== model.userId) {
          await User.update(model.userId, { statusIconNotifications: 'unread' });
        }

        return notificationCreate;
      }
    } catch (error) {
      this.logger.error('Erro ao tentar criar notificação', error);
      await transaction.rollbackTransaction();

      if (!error.message) throw new InternalServerErrorException('internal-server-error');

      throw error;
    } finally {
      await transaction.release();
    }
  }

  public async getUnreadsNotificationsQuantityByUser(user: Partial<User>): Promise<ListUnreadNotifications> {
    try {
      const userId = user.id;
      return await this.aggregatedNotificationsRepository.countNotificationsUnreadsByUser({ userId });
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-get-feed');

      throw error;
    }
  }

  public async getNotifications(user: Partial<User>, params) {
    return this.aggregatedNotificationsRepository.getPaginated(user.id, params);
  }

  public async updateLastStatus(
    aggregatedNotification: Partial<AggregatedNotifications>,
    user: Partial<User>
  ): Promise<AggregatedNotifications> {
    try {
      const aggregatedNotificationSearch = await AggregatedNotifications.findOne(aggregatedNotification.id);

      if (!aggregatedNotificationSearch) throw new NotFoundException('not-found-aggregated-notification');

      if (aggregatedNotificationSearch.userId !== user.id)
        throw new NotFoundException('not-user-of-aggregated-notification');

      if (aggregatedNotificationSearch.lastStatus !== aggregatedNotification.lastStatus) {
        aggregatedNotificationSearch.lastStatus = aggregatedNotification.lastStatus;
        return this.aggregatedNotificationsRepository.update(aggregatedNotificationSearch);
      }
      return aggregatedNotificationSearch;
    } catch (error) {
      this.logger.error(error);
      if (!error.message) throw new InternalServerErrorException('error-update-status');

      throw error;
    }
  }
}
