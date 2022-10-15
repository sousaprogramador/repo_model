import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

//  Controllers
import { CountriesController } from './controllers/countries';
import { StatesController } from './controllers/states';
import { CitiesController } from './controllers/cities';
import { AuthController } from './controllers/auth';
import { DestinationsController } from './controllers/destinations';
import { DestinationsCategoriesController } from './controllers/destinationsCategories';
import { InterestsController } from './controllers/interests';
import { PreferencesController } from './controllers/preferences';
import { RelationshipsController } from './controllers/relationships';
import { TermsController } from './controllers/terms';
import { UsersController } from './controllers/users';
import { PartnersController } from './controllers/partners';
import { BlogsController } from './controllers/blogs';
import { OffersController } from './controllers/offers';
import { WishlistController } from './controllers/wishlist';
import { FeedController } from './controllers/feeds';
import { OffersCategoriesController } from './controllers/offersCategories';
import { UserReviewController } from './controllers/userReview';
import { OffersCategoriesGroupsController } from './controllers/offersCategoriesGroup';
import { OneSignalController } from './controllers/oneSignal';
import { DashboardController } from './controllers/dashboard';
import { NotificationController } from './controllers/notifications';
import { AvaliationsController } from './controllers/avaliations';
import { GalleryController } from './controllers/gallery';
import { UsersImagesController } from './controllers/usersImages';
import { UsersTripsController } from './controllers/usersTrips';

// Repositorios
import { CountriesRepository } from './repositories/countries';
import { StatesRepository } from './repositories/states';
import { CitiesRepository } from './repositories/cities';
import { UsersRepository } from './repositories/users';
import { DestinationRepository } from './repositories/destinations';
import { DestinationsCategoriesRepository } from './repositories/destinationsCategories';
import { InterestsRepository } from './repositories/interests';
import { PreferencesRepository } from './repositories/preferences';
import { RelationshipsRepository } from './repositories/relationships';
import { TermsRepository } from './repositories/terms';
import { DestinationsImagesRepository } from './repositories/destinationsImages';
import { PartnersRepository } from './repositories/partners';
import { BlogsRepository } from './repositories/blogs';
import { OffersRepository } from './repositories/offers';
import { WishlistsRepository } from './repositories/wishlists';
import { UserReviewsRepository } from './repositories/userReview';
import { UserReviewImagesRepository } from './repositories/userReviewImages';
import { FeedRepository } from './repositories/feeds';
import { FeedImagesRepository } from './repositories/feedImages';
import { FeedCommentsRepository } from './repositories/feedComments';
import { FeedLikesRepository } from './repositories/feedLikes';
import { OffersCategoriesGroupsRepository } from './repositories/offersCategoriesGroups';
import { OffersCategoriesRepository } from './repositories/offersCategories';
import { UserReportedReviewRepository } from './repositories/userReportedReview';
import { NotificationsRepository } from './repositories/notifications';
import { AggredgatedNotificationsRepository } from './repositories/aggregatedNotifications';
import { AvaliationsRepository } from './repositories/avaliations';
import { AdjectivesRepository } from '../admin/repositories/adjectives';
import { FollowsRepository } from './repositories/follows';
import { GalleryRepository } from './repositories/gallery';
import { UsersImagesRepository } from './repositories/usersImages';
import { GalleriesUsersImagesRepository } from './repositories/galleriesUsersImages';
import { WishlistsGalleryRepository } from './repositories/wishlistsGallery';
import { UsersTripsRepository } from './repositories/usersTrips';
import { UsersTripsGalleriesRepository } from './repositories/usersTripsGallery';

// Serviços
import { CountriesService } from './services/countries';
import { StatesService } from './services/states';
import { CitiesService } from './services/cities';
import { AuthService } from './services/auth';
import { UsersService } from './services/users';
import { DestinationService } from './services/destinations';
import { DestinationsCategoriesService } from './services/destinationsCategories';
import { InterestsService } from './services/interests';
import { PreferencesService } from './services/preferences';
import { RelationshipsService } from './services/relationships';
import { TermsService } from './services/terms';
import { DestinationImagesService } from './services/destinationsImages';
import { PartnersService } from './services/partners';
import { BlogsService } from './services/blogs';
import { OffersService } from './services/offers';
import { WishlistService } from './services/wishlists';
import { UserReviewService } from './services/userReview';
import { FeedService } from './services/feeds';
import { OffersCategoriesService } from './services/offersCategories';
import { UserReviewImagesService } from './services/userReviewImages';
import { FeedImageService } from './services/feedImages';
import { FeedCommentService } from './services/feedComments';
import { OffersCategoriesGroupsService } from './services/offersCategoriesGroup';
import { OneSignalService } from './services/oneSignal';
import { DashboardService } from './services/dashboard';
import { NotificationsService } from './services/notifications';
import { AggredgatedNotificationsService } from './services/aggregatedNotifications';
import { AvaliationsService } from './services/avaliations';
import { AdjectivesService } from '../admin/services/adjectives';
import { GalleryService } from './services/gallery';
import { UsersImagesService } from './services/usersImages';
import { GalleriesUsersImagesService } from './services/galleriesUsersImages';
import { UsersTripsService } from './services/usersTrips';
import { UsersTripsGalleriesService } from './services/usersTripsGallery';

// ETC
import { jwtConstants } from 'src/settings';
import { DatabaseModule } from '../database/database.module';

import { MailModule } from '../mail/mail.module';
import { CommonModule } from '../common/common.module';

import { AppAuthGuard } from '../app/app-auth.guard';
import { HttpModule } from '@nestjs/axios';

import { JwtStrategy } from '../common/jwt.strategy';
import { AppStrategy } from './app.strategy';
import { ContactController } from './controllers/contact';
import { ContactService } from './services/contact';
import { ContactRepository } from './repositories/contact';
import { APP_GUARD } from '@nestjs/core';
import { InvitationController } from './controllers/invitation';
import { InvitationService } from './services/invitation';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 90
    }),
    DatabaseModule,
    PassportModule,
    JwtStrategy,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' }
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    CommonModule,
    MailModule
  ],
  controllers: [
    AuthController,
    DashboardController,
    UsersController,
    DestinationsController,
    WishlistController,
    FeedController,
    OffersController,
    UserReviewController,
    DestinationsCategoriesController,
    OffersCategoriesController,
    OffersCategoriesGroupsController,
    OneSignalController,
    InterestsController,
    PreferencesController,
    RelationshipsController,
    TermsController,
    PartnersController,
    BlogsController,
    CountriesController,
    StatesController,
    CitiesController,
    ContactController,
    InvitationController,
    NotificationController,
    AvaliationsController,
    GalleryController,
    UsersImagesController,
    UsersTripsController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    CountriesRepository,
    CountriesService,
    StatesRepository,
    StatesService,
    CitiesRepository,
    CitiesService,
    DestinationsCategoriesRepository,
    DestinationsCategoriesService,
    InterestsRepository,
    InterestsService,
    DestinationService,
    DestinationRepository,
    PreferencesRepository,
    PreferencesService,
    RelationshipsRepository,
    RelationshipsService,
    TermsRepository,
    TermsService,
    DestinationsImagesRepository,
    DestinationImagesService,
    PartnersRepository,
    PartnersService,
    BlogsRepository,
    BlogsService,
    OffersRepository,
    OffersService,
    WishlistService,
    UserReviewImagesService,
    UserReviewImagesRepository,
    WishlistsRepository,
    UserReviewService,
    UserReviewsRepository,
    FeedRepository,
    FeedService,
    FeedImagesRepository,
    FeedImageService,
    FeedCommentService,
    FeedCommentsRepository,
    FeedLikesRepository,
    OffersCategoriesGroupsService,
    OffersCategoriesGroupsRepository,
    AuthService,
    UsersService,
    UsersRepository,
    OneSignalService,
    OffersCategoriesService,
    OffersCategoriesRepository,
    DashboardService,
    AppStrategy,
    AppAuthGuard,
    ContactService,
    ContactRepository,
    InvitationService,
    UserReportedReviewRepository,
    NotificationsService,
    NotificationsRepository,
    AggredgatedNotificationsService,
    AggredgatedNotificationsRepository,
    AvaliationsRepository,
    AvaliationsService,
    AdjectivesService,
    AdjectivesRepository,
    FollowsRepository,
    GalleryRepository,
    GalleryService,
    UsersImagesService,
    UsersImagesRepository,
    GalleriesUsersImagesService,
    GalleriesUsersImagesRepository,
    WishlistsGalleryRepository,
    UsersTripsService,
    UsersTripsRepository,
    UsersTripsGalleriesService,
    UsersTripsGalleriesRepository
  ]
})
export class AppModule {}
