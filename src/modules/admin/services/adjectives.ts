import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AwsService } from 'src/modules/common/services/aws';
import { Adjective } from 'src/modules/database/models/adjectives.entity';
import { AdjectivesRepository } from '../repositories/adjectives';
import { CreateAdjective } from '../validators/adjectives/create';
import { UpdateAdjective } from '../validators/adjectives/update';

@Injectable()
class AdjectivesService {
  constructor(private adjectivesRepository: AdjectivesRepository, private awsService: AwsService) {}

  public async create(data: CreateAdjective, iconFile: Express.Multer.File): Promise<Adjective> {
    const fileUploaded = await this.awsService.uploadS3(iconFile, 'icons', false);
    if (!fileUploaded) throw new BadRequestException('upload-failed');

    const adjectiveToSave = new Adjective({ ...data, icon: fileUploaded.url });
    const result = await this.adjectivesRepository.create(adjectiveToSave);

    return result;
  }

  public async read(id: number): Promise<Adjective> {
    const foundAdjective = await this.adjectivesRepository.read(id);
    if (!foundAdjective) throw new NotFoundException('adjective-not-found');

    return foundAdjective;
  }

  public async update(data: UpdateAdjective & { icon?: string }, iconFile?: Express.Multer.File): Promise<Adjective> {
    if (iconFile) {
      const fileUploaded = await this.awsService.uploadS3(iconFile, 'icons');
      if (!fileUploaded) throw new BadRequestException('upload-failed');

      data.icon = fileUploaded.url;
    }

    const result = await this.adjectivesRepository.update(data);
    if (!result) throw new NotFoundException('update-failed');

    return result;
  }

  public async delete(id: number) {
    const result = await this.adjectivesRepository.delete(id);
    return result;
  }

  public async list(rating?: number) {
    const result = await this.adjectivesRepository.list(rating);
    return result;
  }
}

export { AdjectivesService };
