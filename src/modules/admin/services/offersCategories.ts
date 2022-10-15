import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AwsService } from 'src/modules/common/services/aws';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindConditions, FindManyOptions } from 'typeorm';
import { OffersCategory } from '../../database/models/offersCategories.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OffersCategoriesRepository } from '../repositories/offersCategories';
import { ListOfferCategories } from '../validators/offersCategories/get';

@Injectable()
export class OffersCategoriesService {
  constructor(private offersCategoriesRepository: OffersCategoriesRepository, private awsService: AwsService) {}

  public async list(params: ListOfferCategories) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<OffersCategory>;

    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    } else {
      options.order = {
        position: 'ASC'
      };
    }

    const where = {} as FindConditions<OffersCategory>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.offersCategoriesRepository.list(paginationOption, options);
    }

    return this.offersCategoriesRepository.listAll(options);
  }

  public async save(model: OffersCategory, iconFile: Express.Multer.File): Promise<OffersCategory> {
    if (!model.position) {
      model.position = null;
    }

    const fileUploaded = await this.awsService.uploadS3(iconFile, 'icons', false);
    if (!fileUploaded) throw new BadRequestException('upload-failed');

    const toSave = new OffersCategory({ ...model, icon: fileUploaded.url });

    if (model.id) return this.update(toSave);
    return this.create(toSave);
  }

  private async create(model: OffersCategory): Promise<OffersCategory> {
    try {
      const OffersCategory = await this.offersCategoriesRepository.insert(model);
      return OffersCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async update(
    model: OffersCategory & { icon?: string },
    iconFile?: Express.Multer.File
  ): Promise<OffersCategory> {
    const OffersCategory = await this.offersCategoriesRepository.findById(model.id);
    if (!OffersCategory) throw new NotFoundException('not-found');

    if (iconFile) {
      const fileUploaded = await this.awsService.uploadS3(iconFile, 'icons');
      if (!fileUploaded) throw new BadRequestException('upload-failed');

      model.icon = fileUploaded.url;
    }

    return this.update(model);
  }

  public async findById(offersCategoriesId: number): Promise<OffersCategory> {
    const offerCategory = await this.offersCategoriesRepository.findById(offersCategoriesId);
    if (!offerCategory) throw new NotFoundException('not-found');

    return offerCategory;
  }

  public async remove(offersCategoriesId: number): Promise<void> {
    const lead = await this.offersCategoriesRepository.findById(offersCategoriesId);

    if (!lead) {
      throw new NotFoundException('not-found');
    }

    return this.offersCategoriesRepository.remove(offersCategoriesId);
  }
}
