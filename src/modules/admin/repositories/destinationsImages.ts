import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { getRepository } from 'typeorm';
import { DestinationImage } from '../../database/models/destinationsImages.entity';

@Injectable()
export class DestinationsImagesRepository {
  public async listAll(): Promise<DestinationImage[]> {
    return DestinationImage.find();
  }
  public async list(paginationOptions: IPaginationOptions): Promise<Pagination<DestinationImage>> {
    return paginate<DestinationImage>(getRepository(DestinationImage), {
      ...paginationOptions,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP
    });
  }
  public async insert(model: DestinationImage): Promise<DestinationImage> {
    return DestinationImage.save(model);
  }

  public async findById(id: number): Promise<DestinationImage> {
    return DestinationImage.findOne(id);
  }
  public async update(model: DestinationImage): Promise<DestinationImage> {
    return DestinationImage.save(model);
  }
  public async remove(id: number): Promise<void> {
    await DestinationImage.delete(id);
  }
  public async removeByDestinationId(destinationId: number): Promise<void> {
    await DestinationImage.delete({ destinationId });
  }
}
