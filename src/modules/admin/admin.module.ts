import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// ETC
import { jwtConstants } from 'src/settings';
import { CommonModule } from '../common/common.module';
import { JwtStrategy } from '../common/jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { LocalStrategy } from './admin.strategy';
import { AuthController } from './controllers/auth';
import { BlogsController } from './controllers/blogs';
import { CitiesController } from './controllers/cities';

//  Controllers
import { ContactController } from './controllers/contact';
import { CountriesController } from './controllers/countries';
import { DestinationsController } from './controllers/destinations';
import { DestinationsCategoriesController } from './controllers/destinationsCategories';
import { InterestsController } from './controllers/interests';
import { OffersController } from './controllers/offers';
import { OffersCategoriesController } from './controllers/offersCategories';
import { OffersCategoriesGroupsController } from './controllers/offersCategoriesGroup';
import { PartnersController } from './controllers/partners';
import { PreferencesController } from './controllers/preferences';
import { ProductsTypesController } from './controllers/productsTypes';
import { RelationshipsController } from './controllers/relationships';
import { ReportsController } from './controllers/reports';
import { StatesController } from './controllers/states';
import { TermsController } from './controllers/terms';
import { UploadController } from './controllers/upload';
import { UsersController } from './controllers/users';
import { AdjectivesController } from './controllers/adjectives';

// Repositorios
import { BlogsRepository } from './repositories/blogs';
import { CitiesRepository } from './repositories/cities';
import { ContactRepository } from './repositories/contact';
import { CountriesRepository } from './repositories/countries';
import { DestinationRepository } from './repositories/destinations';
import { DestinationsCategoriesRepository } from './repositories/destinationsCategories';
import { DestinationsImagesRepository } from './repositories/destinationsImages';
import { InterestsRepository } from './repositories/interests';
import { OffersRepository } from './repositories/offers';
import { OffersCategoriesRepository } from './repositories/offersCategories';
import { OffersCategoriesGroupsRepository } from './repositories/offersCategoriesGroups';
import { PartnersRepository } from './repositories/partners';
import { PreferencesRepository } from './repositories/preferences';
import { ProductsTypesRepository } from './repositories/productsTypes';
import { RelationshipsRepository } from './repositories/relationships';
import { ReportReviewsRepository } from './repositories/reportReviews';
import { StatesRepository } from './repositories/states';
import { TermsRepository } from './repositories/terms';
import { UserReviewsRepository } from './repositories/userReview';
import { UsersRepository } from './repositories/users';
import { AdjectivesRepository } from './repositories/adjectives';

// Serviços
import { AuthService } from './services/auth';
import { BlogsService } from './services/blogs';
import { CitiesService } from './services/cities';
import { ContactService } from './services/contact';
import { CountriesService } from './services/countries';
import { DestinationService } from './services/destinations';
import { DestinationsCategoriesService } from './services/destinationsCategories';
import { DestinationImagesService } from './services/destinationsImages';
import { InterestsService } from './services/interests';
import { OffersService } from './services/offers';
import { OffersCategoriesService } from './services/offersCategories';
import { OffersCategoriesGroupsService } from './services/offersCategoriesGroup';
import { PartnersService } from './services/partners';
import { PreferencesService } from './services/preferences';
import { ProductsTypesService } from './services/productsTypes';
import { RelationshipsService } from './services/relationships';
import { ReportReviewsService } from './services/reportReviews';
import { StatesService } from './services/states';
import { TermsService } from './services/terms';
import { UploadService } from './services/upload';
import { UsersService } from './services/users';
import { AdjectivesService } from './services/adjectives';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50
    }),
    DatabaseModule,
    PassportModule,
    JwtStrategy,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' }
    }),
    CommonModule
  ],
  controllers: [
    CountriesController,
    StatesController,
    CitiesController,
    DestinationsCategoriesController,
    InterestsController,
    AuthController,
    DestinationsController,
    PreferencesController,
    RelationshipsController,
    TermsController,
    UsersController,
    PartnersController,
    BlogsController,
    OffersController,
    UploadController,
    OffersCategoriesController,
    OffersCategoriesGroupsController,
    ProductsTypesController,
    ReportsController,
    ContactController,
    AdjectivesController,
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
    UploadService,
    OffersCategoriesService,
    OffersCategoriesRepository,
    OffersCategoriesGroupsService,
    OffersCategoriesGroupsRepository,
    ProductsTypesRepository,
    ProductsTypesService,
    ReportReviewsRepository,
    UserReviewsRepository,
    ReportReviewsService,

    AuthService,
    UsersService,
    UsersRepository,
    LocalStrategy,
    ContactRepository,
    ContactService,

    AdjectivesRepository,
    AdjectivesService,
  ]
})
export class AdminModule {}
