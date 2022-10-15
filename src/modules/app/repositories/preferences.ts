import { Injectable } from '@nestjs/common';
import { Preference } from 'src/modules/database/models/preferences.entity';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';
@Injectable()
export class PreferencesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<Preference>
  ): Promise<Pagination<Preference>> {
    return paginate<Preference>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async listAll(): Promise<Preference[]> {
    return Preference.find({
      where: {
        status: true
      }
    });
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<Preference>> {
    return paginate<Preference>(
      getRepository(Preference),
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
  async findById(id: number): Promise<Preference> {
    return Preference.findOne(id, {
      where: {
        status: true
      }
    });
  }
}
