import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { Notifications } from 'src/modules/database/models/notifications.entity';
@Injectable()
export class NotificationsRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Notifications>
  ): Promise<Pagination<Notifications>> {
    return paginate<Notifications>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Notifications>> {
    return paginate<Notifications>(
      getRepository(Notifications),
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

  public async listAll(): Promise<Notifications[]> {
    return Notifications.find();
  }

  public async findOne(options: FindOneOptions<Notifications>) {
    return Notifications.findOne(options);
  }

  public async update(model: Notifications): Promise<Notifications> {
    return Notifications.save(model);
  }

  async findById(id: number): Promise<Notifications> {
    return Notifications.findOne(id);
  }
}
