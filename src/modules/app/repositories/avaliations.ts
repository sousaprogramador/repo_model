import { Injectable } from '@nestjs/common';
import { IPagination, IPaginationOptions, IPaginated } from 'src/modules/common/services/pagination';
import { Avaliation } from 'src/modules/database/models/avaliations.entity';

@Injectable()
class AvaliationsRepository {
  public async create(data: Partial<Avaliation>): Promise<Avaliation> {
    const newAvaliation = new Avaliation(data);
    const result = newAvaliation.save();

    return result;
  }

  public async read(id: number): Promise<Avaliation> {
    const foundAvaliation = await Avaliation.findOne(id);
    return foundAvaliation;
  }

  public async getByUser(
    userId: number,
    paginationOptions: IPaginationOptions,
    order?: 'ASC' | 'DESC'
  ): Promise<IPaginated<Avaliation>> {
    if (order !== 'ASC' && order !== 'DESC') order = 'DESC';

    const result = await IPagination.paginate<Avaliation>(Avaliation.getRepository(), paginationOptions, {
      where: { userId },
      order: { createdAt: order }
    });

    return result;
  }

  public async userMeanRating(userId: number): Promise<{ mean: number, avaliations: number }> {
    const { sum, count } = await Avaliation.createQueryBuilder()
      .select('COALESCE(SUM(rating),0)', 'sum')
      .addSelect('COUNT(*)', 'count')
      .where({ userId })
      .getRawOne();

    const mean = sum > 0 ? sum / count : sum;

    return { mean: parseInt(mean), avaliations: parseInt(count) };
  }
}

export { AvaliationsRepository };
