import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { MAIL } from 'src/settings';
import { User } from '../database/models/users.entity';

@Injectable()
export class MailService {
  logger: Logger;
  constructor(private mailerService: MailerService) {
    this.logger = new Logger('MailService');
  }

  async sendUserConfirmation(user: User, token: string, url: string): Promise<void> {
    try {
      const mailOptions = {
        from: MAIL.FROM,
        to: user.email,
        subject: 'Pinguim App - confirmação de email',
        template: `${path.resolve(__dirname, '..', '..', 'mail', 'templates')}/confirmation`,
        context: {
          name: user.name,
          token,
          url
        }
      };

      await this.mailerService.sendMail(mailOptions);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendUserSuccessConfirmation(name: string, email: string): Promise<void> {
    console.log('#', name, email);
    try {
      const mailOptions = {
        from: MAIL.FROM,
        to: email,
        subject: 'Pinguim App - email confirmado',
        template: `${path.resolve(__dirname, '..', '..', 'mail', 'templates')}/confirmationSuccess`,
        context: {
          name
        }
      };

      await this.mailerService.sendMail(mailOptions);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async sendForgotPassword(user: User, url: string) {
    const urlPath = path.resolve(__dirname, '..', '..', 'mail', 'templates') + '/forgotPass';

    console.log('### urlPath', urlPath);

    const mailOptions = {
      from: MAIL.FROM,
      to: user.email,
      subject: 'Pinguim App - Esqueceu a senha?',
      template: urlPath,
      context: {
        name: user.name,
        url
      }
    };
    return await this.mailerService.sendMail(mailOptions);
  }

  async sendAccountDeletionConfirmationRequest(user: User, url: string) {
    try {
      const mailOptions = {
        from: MAIL.FROM,
        to: user.email,
        subject: 'Pinguim App - Deletar sua conta?',
        template: path.resolve(__dirname, '..', '..', 'mail', 'templates') + '/confirmDelete',
        context: {
          name: user.name,
          url
        }
      };
      return this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('email-not-sent');
    }
  }

  async sendEmailReportedReview(emailData: any) {
    try {
      const { nameUser, reason, message, review } = emailData;

      const mailOptions = {
        from: MAIL.FROM,
        to: MAIL.TO,
        subject: 'Pinguim App - Denúncia',
        template: path.resolve(__dirname, '..', '..', 'mail', 'templates') + '/report',
        context: {
          nameUser,
          reason,
          message,
          review
        }
      };

      return await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('email-not-sent');
    }
  }

  async sendContactApp(user: User, complaint: boolean, subject: string, description: string) {
    const subjects = {
      help: 'Ajuda',
      partnership: 'Parceria',
      suggestion: 'Sugestão',
      problem: 'Encontrei um problema',
      story: 'História',
      fakeAccount: 'Conta falsa',
      minor: 'Criança menor de idade',
      hateSpeech: 'Discurso de ódio',
      invalidAccount: 'Conta inválida',
      porn: 'Nudez ou pornografia',
      other: 'Outro'
    };
    const mailOptions = {
      from: MAIL.FROM,
      to: MAIL.TO,
      subject: 'Pinguim App - Contato APP',
      template: path.resolve(__dirname, '..', '..', 'mail', 'templates') + '/faleConosco',
      context: {
        complaintType: complaint ? 'Nova Denúncia' : 'Nova Mensagem',
        name: user.name,
        email: user.email,
        complaint,
        subject: subjects[subject] || 'Descrição',
        description
      }
    };

    return await this.mailerService.sendMail(mailOptions);
  }
  async sendInvitation(emailSenders: Array<string>, user: User, url: string) {
    const mailOptions = {
      from: MAIL.FROM,
      bcc: emailSenders,
      subject: 'Pinguim App - Convite',
      template: path.resolve(__dirname, '..', '..', 'mail', 'templates') + '/invitation',
      context: {
        complaintType: 'Convite',
        name: user.name,
        url
      }
    };

    return await this.mailerService.sendMail(mailOptions);
  }

  async sendSummary(user: Partial<User>, likes: number, comments: number) {
    try {
      const mailOptions = {
        from: MAIL.FROM,
        to: user.email,
        subject: 'Pinguim App - Resumo semanal',
        template: path.resolve(__dirname, '..', '..', 'mail', 'templates') + '/weeklySummary',
        context: {
          name: user.name,
          likes,
          comments
        }
      };

      return await this.mailerService.sendMail(mailOptions);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
