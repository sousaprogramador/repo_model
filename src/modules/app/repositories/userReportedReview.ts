import { Injectable } from '@nestjs/common';
import { UserReportedReview } from 'src/modules/database/models/usersReportedReviews.entity';

@Injectable()
export class UserReportedReviewRepository {
  public async insert(model: UserReportedReview): Promise<UserReportedReview> {
    return UserReportedReview.save(model);
  }
}
