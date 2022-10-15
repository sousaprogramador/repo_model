import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/modules/admin/repositories/users';
import { User } from 'src/modules/database/models/users.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { Invitation } from '../validators/invitation/save';
import { UsersService } from './users';

@Injectable()
export class InvitationService {
  constructor(
    private mailService: MailService,
    private userService: UsersService,
    private usersRepository: UsersRepository
  ) {}

  public async save(model: Invitation, user: User, url: string): Promise<boolean> {
    return this.create(model, user, url);
  }

  private async create(model: Invitation, user: User, url?: string): Promise<boolean> {
    try {
      const { emails } = model;
      const usersFinded = await this.userService.findUsersByEmail(emails);

      const userLogged = await this.usersRepository.findById(user.id);
      if (!userLogged) throw new NotFoundException('user-not-found');

      const emailData = [];
      usersFinded.map(user => {
        emailData.push(user.email);
      });

      const usersNotFinded = emails.filter(email => !emailData.includes(email));

      if (usersNotFinded.length) {
        await this.mailService.sendInvitation(usersNotFinded, userLogged, url);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
