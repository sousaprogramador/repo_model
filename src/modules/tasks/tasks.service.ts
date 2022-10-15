import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { getRepository } from 'typeorm';
import { FeedComment } from '../database/models/feedComments.entity';
import { FeedLike } from '../database/models/feedLikes.entity';
import { User } from '../database/models/users.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TaskService {
  logger: Logger;
  constructor(private mailService: MailService) {
    this.logger = new Logger('TaskService');
  }
  // @Cron(CronExpression.EVERY_30_SECONDS, {
  //   name: 'Send summary'
  // })
  @Cron('0 5 * * 1', {
    name: 'Send summary'
  })
  async sendNotifications() {
    const last7days = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    try {
      const likes = await getRepository(FeedLike)
        .createQueryBuilder('feedLikes')
        .leftJoinAndSelect('feedLikes.feed', 'feed')
        .leftJoinAndSelect('feed.user', 'user')
        .select(['feedLikes.id', 'feedLikes.feedId', 'feed.id', 'feed.userId', 'user.name', 'user.id', 'user.email'])
        .where('feedLikes.createdAt > :lastWeek', {
          lastWeek: last7days
        })
        .getMany();

      const comments = await getRepository(FeedComment)
        .createQueryBuilder('feedComments')
        .leftJoinAndSelect('feedComments.feed', 'feed')
        .leftJoinAndSelect('feed.user', 'user', 'user.id = feed.userId')
        .select([
          'feedComments.id',
          'feedComments.feedId',
          'feed.id',
          'feed.userId',
          'user.name',
          'user.id',
          'user.email'
        ])
        .where('feedComments.createdAt > :lastWeek', {
          lastWeek: last7days
        })
        .getMany();

      // mapear os usuarios pelos ids
      const usersToSendEmail = {};
      // Salvando os likes na propriedade (userId do dono da postagem) referente ao usuario
      for (const like of likes) {
        if (like?.feed?.user) {
          // ID do usuario do da postagem
          const userId = like.feed.user.id;

          if (!usersToSendEmail?.[userId]?.likes) {
            usersToSendEmail[userId] = {
              likes: []
            };
          }

          usersToSendEmail[userId].likes.push(like);
        }
      }
      // Salvando os comentarios na propriedade (userId do dono da postagem) referente ao usuario
      for (const comment of comments) {
        if (comment?.feed?.user) {
          // ID do usuario do da postagem
          const userId = comment.feed.user.id;

          if (!usersToSendEmail?.[userId]?.comments) {
            usersToSendEmail[userId] = {
              ...usersToSendEmail[userId],
              comments: []
            };
          }
          usersToSendEmail[userId].comments.push(comment);
        }
      }

      const userIds = Object.keys(usersToSendEmail);

      for await (const userId of userIds) {
        // Dados do usuário
        const user: User | null =
          usersToSendEmail[Number(userId)].likes?.[0]?.feed?.user ||
          usersToSendEmail[Number(userId)].comments?.[0]?.feed?.user ||
          null;

        usersToSendEmail[userId] = {
          sendMail: false
        };

        if (!usersToSendEmail[userId]?.sendMail) {
          if (user?.email) {
            let likes = 0;
            let comments = 0;

            if (usersToSendEmail[userId].likes?.length > 0) {
              likes = usersToSendEmail[userId].likes.length;
            }

            if (usersToSendEmail[userId].comments?.length > 0) {
              comments = usersToSendEmail[userId].comments.length;
            }

            //validando se o email o usuario ja foi enviado (evitando envios duplicados)
            //caso a query retorne mais de um ids iguais, ira enviar apenas um
            await this.mailService.sendSummary(user, likes, comments);
            usersToSendEmail[userId].sendMail = true;
          } else {
            this.logger.error(`Usuário não encontrado para enviar o resumo semanal: ${userId}`);
          }
        }
      }
    } catch (error) {
      console.log('error', error);
      this.logger.error(error);
    }
  }
}
