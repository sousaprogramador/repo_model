import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Contact } from 'src/modules/database/models/contact.entity';
import { User } from 'src/modules/database/models/users.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { FindConditions, FindManyOptions } from 'typeorm';
import { ContactRepository } from '../repositories/contact';
import { ListContacts } from '../validators/contact/get';

@Injectable()
export class ContactService {
  constructor(private contactRepository: ContactRepository, private mailService: MailService) {}

  public async list(params: ListContacts, userLogged?: Partial<User>) {
    const { page, limit, ...rest } = params;
    const paginationOption: IPaginationOptions = {} as IPaginationOptions;

    const options = {} as FindManyOptions<Contact>;
    if (rest.order && rest.orderBy) {
      options.order = {
        [rest.orderBy]: rest.order
      };
    }

    const where = {} as FindConditions<Contact>;
    where.userId = userLogged.id;

    if (rest.subject) {
      where.subject = rest.subject;
    }

    if (rest.complaint) {
      const isTrue = String(rest.complaint) === 'true';
      where.complaint = isTrue ? isTrue : false;
    }
    // os dados de busca
    options.where = where;

    if (page && limit) {
      paginationOption.page = page;
      paginationOption.limit = limit;
      return this.contactRepository.list(paginationOption, options);
    }
    // Outras opções de search
    return this.contactRepository.listAll(options);
  }

  public async save(model: Contact, user: User): Promise<Contact> {
    model.userId = user.id;
    if (model.id) return this.update(model);
    return this.create(model, user);
  }

  private async create(model: Contact, user: User): Promise<Contact> {
    try {
      let isComplaint = false;
      if (model.complaint) {
        const isTrue = String(model.complaint) === 'true';
        isComplaint = isTrue ? true : false;
      }
      await this.mailService.sendContactApp(user, isComplaint, model.subject, model.description);

      return await this.contactRepository.insert(model);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async findById(ContactId: number): Promise<Contact> {
    const contact = await this.contactRepository.findById(ContactId);

    if (!contact) throw new NotFoundException('not-found');

    return contact;
  }

  private async update(model: Contact): Promise<Contact> {
    const contact = await this.contactRepository.findById(model.id);
    if (!contact) throw new NotFoundException('not-found');

    return this.contactRepository.update(model);
  }

  public async remove(contactId: number): Promise<void> {
    const contact = await this.contactRepository.findById(contactId);

    if (!contact) {
      throw new NotFoundException('not-found');
    }

    return this.contactRepository.remove(contactId);
  }
}
