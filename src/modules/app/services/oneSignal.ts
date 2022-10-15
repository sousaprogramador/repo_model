import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ONESIGNAL } from '../../../settings';
import { CreateNotification } from '../validators/onesignal/save';
import { UsersService } from './users';

@Injectable()
export class OneSignalService {
  logger: Logger;
  constructor(@Inject(forwardRef(() => UsersService)) private usersService: UsersService) {
    this.logger = new Logger('OneSignalService');
  }

  public async sendNotification(model: CreateNotification): Promise<boolean> {
    const { userId, title, message, data } = model;

    try {
      const user = await this.usersService.findOne({
        id: userId
      });

      if (!user.sendNotifications) return false;

      await axios.post(ONESIGNAL.ENDPOINT_API, {
        app_id: ONESIGNAL.APP_ID,
        include_player_ids: [user.tokenOneSignal],
        contents: { en: message },
        headings: { en: title },
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
        data
      });

      return true;
    } catch (e) {
      this.logger.error(e);

      return false;
    }
  }
}
