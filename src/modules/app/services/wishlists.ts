import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UsersService } from 'src/modules/app/services/users';
import { User } from 'src/modules/database/models/users.entity';
import { Wishlist } from 'src/modules/database/models/wishlists.entity';
import { DestinationRepository } from '../repositories/destinations';
import { OffersRepository } from '../repositories/offers';
import { WishlistsRepository } from '../repositories/wishlists';
import { ListUsers } from '../validators/users/get';
import { GetWishlist } from '../validators/wishlist/get';
import { CreateWishlist } from '../validators/wishlist/save';
import { WishlistsGalleryRepository } from '../repositories/wishlistsGallery';
import { WishlistsGallery } from 'src/modules/database/models/wishlistsGallery.entity';

@Injectable()
export class WishlistService {
  logger: Logger;
  constructor(
    private wishlistsRepository: WishlistsRepository,
    private destinationRepository: DestinationRepository,
    private offerRepository: OffersRepository,
    private userService: UsersService,
    private wishlistsGalleryRepository: WishlistsGalleryRepository
  ) {
    this.logger = new Logger();
  }

  public async getUsers(userId: number, params: ListUsers) {
    try {
      const { page, limit, rand } = params;

      const paginationOption: IPaginationOptions = {
        page: page || 1,
        limit: limit || 10
      };

      const user = await this.userService.findById(userId);

      if (!user) throw new NotFoundException('user-not-found');

      const myWishlists = (await this.wishlistsRepository.findByUserId(user.id)) as Wishlist[];

      const destinationsIds = myWishlists.map(wishlist => wishlist.destinationId);

      return this.wishlistsRepository.getUsersByDestinations(destinationsIds, user.id, paginationOption, rand);
    } catch (e) {
      this.logger.error('Error getUsers WishlistService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  public async wishlists(userId: number, params?: GetWishlist, userLoggedId?: Partial<User>) {
    try {
      const user = await this.userService.findById(userId);

      if (!user) throw new NotFoundException('user-not-found');

      return this.wishlistsRepository.findByUserId(user.id, params, userLoggedId);
    } catch (e) {
      this.logger.error('Error wishlists WishlistService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }

  private async deleteWishlist(wishlistId: number) {
    await this.wishlistsRepository.update({
      id: wishlistId,
      deletedAt: new Date(),
      status: false
    } as Wishlist);

    return this.wishlistsRepository.findOne({
      where: {
        id: wishlistId
      },
      withDeleted: true
    });
  }

  public async toggleWishlist(model: CreateWishlist, user: Partial<User>): Promise<Wishlist> {
    try {
      const { id } = user;

      const { destinationId, offerId, tripDate } = model;

      if (!destinationId && !offerId) throw new BadRequestException('offer-or-destination-must-be-sent');

      if (destinationId && offerId) throw new BadRequestException('only-one-must-be-sent');

      if (destinationId) {
        const destination = await this.destinationRepository.findById(destinationId);

        if (!destination) throw new NotFoundException('destination-not-found');

        const wishlist = await this.wishlistsRepository.findOne({
          where: {
            destinationId,
            userId: id
          }
        });

        if (wishlist) {
          return this.deleteWishlist(wishlist.id);
        }
        const newWishlist = {
          destinationId,
          userId: id,
          tripDate
        } as Wishlist;

        const wish = await this.wishlistsRepository.insert(newWishlist);
        if (wish && model.galleryId) {
          const gallery = {
            galleryId: model.galleryId,
            wishlistId: wish.id
          } as WishlistsGallery;

          this.wishlistsGalleryRepository.insert(gallery);
        }
      }

      if (offerId) {
        const offer = await this.offerRepository.findById(offerId);

        if (!offer) throw new NotFoundException('offer-not-found');

        const wishlist = await this.wishlistsRepository.findOne({
          where: {
            offerId,
            userId: id
          }
        });

        if (wishlist) {
          return this.deleteWishlist(wishlist.id);
        }

        const newWishlist = {
          offerId,
          userId: id,
          tripDate
        } as Wishlist;
        return this.wishlistsRepository.insert(newWishlist);
      }
    } catch (e) {
      this.logger.error('Error toggleWishlist WishlistService: ', e);
      if (!e.message) throw new InternalServerErrorException('internal-server-error');
      throw e;
    }
  }
}
