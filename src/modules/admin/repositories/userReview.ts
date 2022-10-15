import { Injectable, NotFoundException } from '@nestjs/common';
import { UserReview } from 'src/modules/database/models/usersReviews.entity';
import { getRepository } from 'typeorm';
@Injectable()
export class UserReviewsRepository {
  public async toggleStatusReview(id: number): Promise<UserReview> {
    const review = await getRepository(UserReview)
      .createQueryBuilder('review')
      .where('review.id = :reviewId', {
        reviewId: id
      })
      .withDeleted()
      .getOne();

    if (!review) throw new NotFoundException('review-not-found');

    if (!review.status) {
      await UserReview.save({
        id: review.id,
        status: true,
        deletedAt: null
      } as UserReview);
    } else {
      await UserReview.save({
        id: review.id,
        status: false,
        deletedAt: new Date()
      } as UserReview);
    }

    return UserReview.findOne(id, {
      withDeleted: true
    });
  }

  public async remove(id: number): Promise<void> {
    await UserReview.delete({ id } as UserReview);
  }
}
