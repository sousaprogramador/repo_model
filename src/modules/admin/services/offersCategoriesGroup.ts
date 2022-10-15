import { BadRequestException, BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { FindConditions, FindManyOptions } from 'typeorm';
import { AwsService } from 'src/modules/common/services/aws';
import { OffersCategoriesGroups } from '../../database/models/offersCategoriesGroups.entity';
import { OffersCategoriesGroupsRepository } from '../repositories/offersCategoriesGroups';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ListOfferGroupCategories } from '../validators/offersCategoriesGroup/get';
import { CreateOffersGroupsCategories } from '../validators/offersCategoriesGroup/save';

@Injectable()
export class OffersCategoriesGroupsService {
  constructor(
    private offersCategoriesGroupsRepository: OffersCategoriesGroupsRepository,
    private awsService: AwsService
  ) {}

  public async list(params: ListOfferGroupCategories) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;
    const options = {} as FindManyOptions<OffersCategoriesGroups>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<OffersCategoriesGroups>;
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.offersCategoriesGroupsRepository.list(paginationOption, options);
    }

    return this.offersCategoriesGroupsRepository.listAll(options);
  }

  public async save(
    model: CreateOffersGroupsCategories,
    iconFile: Express.Multer.File
  ): Promise<OffersCategoriesGroups> {
    const fileUploaded = await this.awsService.uploadS3(iconFile, 'icons', false);
    if (!fileUploaded) throw new BadRequestException('upload-failed');

    const toSave = new CreateOffersGroupsCategories({ ...model, icon: fileUploaded.url });

    if (model.id) return this.update(toSave);
    return this.create(toSave);
  }

  private async create(model: CreateOffersGroupsCategories): Promise<OffersCategoriesGroups> {
    let categoriesId: number[] = [];
    if (model.categories) {
      categoriesId = model.categories;
      delete model.categories;
    }

    try {
      const offerCategoryGroup = await this.offersCategoriesGroupsRepository.insert(model as OffersCategoriesGroups);

      if (offerCategoryGroup && categoriesId.length > 0) {
        await this.offersCategoriesGroupsRepository.updateCategories(offerCategoryGroup.id, categoriesId);
      }

      return this.findById(offerCategoryGroup.id);
    } catch (error) {
      throw new BadGatewayException(error.message || 'create-group-failed');
    }
  }

  private async update(
    model: CreateOffersGroupsCategories & { icon?: string },
    iconFile?: Express.Multer.File
  ): Promise<OffersCategoriesGroups> {
    const offerCategoryGroup = await this.offersCategoriesGroupsRepository.findById(model.id);
    if (!offerCategoryGroup) throw new NotFoundException('not-found');

    let categoriesId: number[] = [];
    if (model.categories) {
      categoriesId = model.categories;
      delete model.categories;
    }

    if (offerCategoryGroup && categoriesId.length >= 0) {
      await this.offersCategoriesGroupsRepository.deleteCategoriesByGroupId(offerCategoryGroup.id);
      await this.offersCategoriesGroupsRepository.updateCategories(offerCategoryGroup.id, categoriesId);
    }
    const offerCategoryGroupUpdated = await this.offersCategoriesGroupsRepository.update(
      model as OffersCategoriesGroups
    );

    if (iconFile) {
      const fileUploaded = await this.awsService.uploadS3(iconFile, 'icons');
      if (!fileUploaded) throw new BadRequestException('upload-failed');

      model.icon = fileUploaded.url;
    }

    return this.findById(offerCategoryGroupUpdated.id);
  }

  public async findById(offersCategoriesId: number): Promise<OffersCategoriesGroups> {
    const offerCategory = await this.offersCategoriesGroupsRepository.findById(offersCategoriesId);
    if (!offerCategory) throw new NotFoundException('not-found');

    return offerCategory;
  }

  public async remove(offersCategoriesId: number): Promise<void> {
    const lead = await this.offersCategoriesGroupsRepository.findById(offersCategoriesId);

    if (!lead) {
      throw new NotFoundException('not-found');
    }

    return this.offersCategoriesGroupsRepository.remove(offersCategoriesId);
  }
}
