import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Contact } from 'src/modules/database/models/contact.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { FindConditions, FindManyOptions } from 'typeorm';
import { ContactRepository } from '../repositories/contact';
import { ListContacts } from '../validators/contact/get';

@Injectable()
export class ContactService {
  constructor(private contactRepository: ContactRepository, private mailService: MailService) {}

  public async list(params: ListContacts) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<Contact>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    } else {
      options.order = {
        createdAt: 'ASC'
      };
    }

    const where = {} as FindConditions<Contact>;

    if (rest.subject) {
      where.subject = rest.subject;
    }

    if (rest.complaint) {
      const isTrue = String(rest.complaint) === 'true';
      where.complaint = isTrue ? isTrue : false;
    }
    // os dados de busca
    options.where = where;

    options.relations = ['user'];

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.contactRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.contactRepository.listAll(options);
  }

  public async findById(ContactId: number): Promise<Contact> {
    const contact = await this.contactRepository.findById(ContactId);

    if (!contact) throw new NotFoundException('not-found');

    return contact;
  }

  public async remove(contactId: number): Promise<void> {
    const contact = await this.contactRepository.findById(contactId);

    if (!contact) {
      throw new NotFoundException('not-found');
    }

    return this.contactRepository.remove(contactId);
  }
}
