import { Injectable } from '@nestjs/common';
import { Adjective } from 'src/modules/database/models/adjectives.entity';
import { getRepository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
class AdjectivesRepository {
  public async create(data: Adjective): Promise<Adjective> {
    const result = await getRepository(Adjective).save(data);
    return result;
  }

  public async read(id: number): Promise<Adjective> {
    const foundAdjective = await getRepository(Adjective).findOne({ id, deletedAt: null });
    return foundAdjective;
  }

  public async update(data: { id: number } & Partial<Adjective>): Promise<Adjective> {
    const updatedAdjective = await getRepository(Adjective).createQueryBuilder()
      .update(Adjective, data)
      .where('adjectives.id = :id', { id: data.id })
      .updateEntity(true)
      .execute();

    if (updatedAdjective.affected !== 1) return;

    const foundAdjective = await getRepository(Adjective).findOne(data.id);
    return foundAdjective;
  }

  public async delete(id: number): Promise<Adjective> {
    const result = await getRepository(Adjective).save({ id, deletedAt: new Date() });
    return result;
  }

  public async list(rating?: number): Promise<Adjective[]> {
    if (rating) {
      const result = await getRepository(Adjective).find({
        where: { maxRating: MoreThanOrEqual(Number(rating)), minRating: LessThanOrEqual(Number(rating)) },
      });

      return result;
    }

    const result = await getRepository(Adjective).find();
    return result;
  }
}

export { AdjectivesRepository };
