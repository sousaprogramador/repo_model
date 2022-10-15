import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, Not, SelectQueryBuilder } from 'typeorm';
import { AggregatedNotifications } from 'src/modules/database/models/aggregatedNotifications.entity';
import { Notifications } from 'src/modules/database/models/notifications.entity';
import { User } from 'src/modules/database/models/users.entity';
import { ListUnreadNotifications } from '../validators/notifications/getUnreadsNotifications';
@Injectable()
export class AggredgatedNotificationsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<AggregatedNotifications>
  ): Promise<Pagination<AggregatedNotifications>> {
    return paginate<AggregatedNotifications>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async update(model: AggregatedNotifications): Promise<AggregatedNotifications> {
    return AggregatedNotifications.save(model as AggregatedNotifications);
  }

  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<AggregatedNotifications>> {
    return paginate<AggregatedNotifications>(
      getRepository(AggregatedNotifications),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        where: {
          status: true
        }
      }
    );
  }

  public async countNotificationsUnreadsByUser(
    model: Partial<AggregatedNotifications>
  ): Promise<ListUnreadNotifications> {
    const { statusIconNotifications } = await User.findOne({
      where: { id: model.userId },
      select: ['statusIconNotifications']
    });
    const totalUnreadNotifications = await AggregatedNotifications.count({
      where: {
        lastStatus: 'unread',
        userId: model.userId
      }
    });

    const paginated = {
      statusIconNotifications,
      totalUnreadNotifications
    };

    return paginated;
  }

  public async listAll(): Promise<AggregatedNotifications[]> {
    return AggregatedNotifications.find();
  }

  async findById(id: number): Promise<AggregatedNotifications> {
    return AggregatedNotifications.findOne(id);
  }

  async getPaginated(id: number, params: IPaginationOptions) {
    const limit = Number(params.limit) || 10;
    const page = (Number(params.page) - 1) * limit;

    await User.update(id, { statusIconNotifications: 'read' });

    const [items, totalCount] = await AggregatedNotifications.findAndCount({
      where: {
        userId: id,
        lastStatus: Not('deleted')
      },
      order: {
        lastUpdatedAtNotifications: 'DESC'
      },
      relations: ['feed'],
      skip: page,
      take: limit
    });

    const aggregatesWithNotificationsToShow = await Promise.all(
      items.map(async data => {
        const totalNotificationPerAggregate = await Notifications.count({
          where: { aggregatedNotificationId: data.id, status: Not('deleted') }
        });

        const originUserIds = [];

        // Trazer apenas notificações com originUserId distintos (Não feito)
        let notifications = await Notifications.createQueryBuilder('notifications')
          .where({ aggregatedNotificationId: data.id, status: Not('deleted') })
          .orderBy({ updatedAt: 'DESC', originUserId: 'DESC' })
          .limit(3)
          .getMany();

        const userToShow = await Promise.all(
          notifications.map(async notification => {
            if (!originUserIds.includes(notification.originUserId)) {
              originUserIds.push(notification.originUserId);
              const user = await User.findOne(notification.originUserId);
              notification.user = user;
              return notification;
            }
            return null;
          })
        );

        notifications = notifications.filter(notification => notification?.user);

        // Usuário que deu origem a notificação
        notifications['user'] = userToShow;

        // Total de notificações por agregado
        data['totalNotificationPerAggregate'] = Number(totalNotificationPerAggregate);

        data.notifications = notifications;

        return data;
      })
    );

    const paginated = {
      items: aggregatesWithNotificationsToShow,
      meta: {
        itemCount: limit,
        totalItems: aggregatesWithNotificationsToShow.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(params.page) || 1
      }
    };

    return paginated;
  }
}
