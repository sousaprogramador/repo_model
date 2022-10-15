import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { Contact } from 'src/modules/database/models/contact.entity';
import { FindConditions, FindManyOptions, getRepository } from 'typeorm';

@Injectable()
export class ContactRepository {
  public async listAll(options: FindManyOptions<Contact>): Promise<Contact[]> {
    return Contact.find({
      ...options
    });
  }
  public async list(
    paginationOptions: IPaginationOptions,
    options: FindManyOptions<Contact>
  ): Promise<Pagination<Contact>> {
    return paginate<Contact>(
      getRepository(Contact),
      {
        ...paginationOptions,
        paginationType: PaginationTypeEnum.TAKE_AND_SKIP
      },
      {
        ...options
      }
    );
  }

  public async findById(id: number): Promise<Contact> {
    return Contact.findOne(id);
  }
  public async findOne(where: FindConditions<Contact>): Promise<Contact> {
    return Contact.findOne({
      where
    });
  }

  public async remove(id: number): Promise<void> {
    await Contact.delete(id);
  }
}
