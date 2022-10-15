import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DestinationService } from 'src/modules/app/services/destinations';
import { OffersService } from 'src/modules/app/services/offers';
import { OffersCategoriesService } from 'src/modules/app/services/offersCategories';
import { UsersService } from 'src/modules/app/services/users';
import { User } from 'src/modules/database/models/users.entity';
import { DashboardPaginationQuery } from '../validators/dashboard/get';
import { ListDestination } from '../validators/destinations/get';
import { ListOfferCustom } from '../validators/offers/get';

@Injectable()
export class DashboardService {
  logger: Logger;
  constructor(
    private destinationService: DestinationService,
    private offersService: OffersService,
    private usersService: UsersService,
    private offersCategoriesService: OffersCategoriesService
  ) {
    this.logger = new Logger('DashboardService App');
  }

  public async getHomeData(query: DashboardPaginationQuery, user: Partial<User>) {
    const { limit, page, rand, ...rest } = query;

    try {
      const offersParams = {
        page: page || 1,
        limit: limit || 10,
        rand
      } as ListOfferCustom;

      if (rest.offersCategoryId) offersParams.categories = [Number(rest.offersCategoryId)];

      const [destinations, offers, users, categories] = await Promise.all([
        this.destinationService.list({ limit, page, rand } as ListDestination, user),
        this.offersService.list(offersParams, user),
        this.usersService.usersByInterests(user, {
          limit,
          page,
          rand
        }),
        this.offersCategoriesService.list({ limit, page })
      ]);

      return {
        offersCategories: categories,
        usersByInterestsQuery: users,
        destinations,
        offers
      };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('get-home-failed');
    }
  }
}
