import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository, SelectQueryBuilder } from 'typeorm';
import { DestinationImage } from '../../database/models/destinationsImages.entity';

@Injectable()
export class DestinationsImagesRepository {
  public async paginate(
    paginationOptions: IPaginationOptions,
    selectQueryBuilder: SelectQueryBuilder<DestinationImage>
  ): Promise<Pagination<DestinationImage>> {
    return paginate<DestinationImage>(selectQueryBuilder, {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }
  public async listAll(): Promise<DestinationImage[]> {
    return DestinationImage.find();
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<DestinationImage>> {
    return paginate<DestinationImage>(getRepository(DestinationImage), {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }

  public async findById(id: number): Promise<DestinationImage> {
    return DestinationImage.findOne(id);
  }
}
