import { Injectable } from '@nestjs/common';
import { paginate, Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { IPagination, IPaginated, IPaginationOptions } from 'src/modules/common/services/pagination';
import { Feed } from 'src/modules/database/models/feeds.entity';
import { User } from 'src/modules/database/models/users.entity';
import { FindManyOptions, FindOneOptions, getRepository, createQueryBuilder, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class FeedRepository {
  public async listAll(options: FindManyOptions<Feed>): Promise<Feed[]> {
    return Feed.find(options);
  }

  public async list(paginationOptions: IPaginationOptions, options: FindManyOptions<Feed>): Promise<IPaginated<Feed>> {
    const result = await IPagination.paginate(getRepository(Feed), paginationOptions, {
      relations: ['user', 'images', 'comments', 'comments.user', 'likes', 'likes.user'],
      ...options
    });

    return result;
  }

  public async listWithCount(
    user: Partial<User>,
    paginationOptions: IPaginationOptions,
    search?: number
  ): Promise<IPaginated<Feed>> {
    const queryBuilder = createQueryBuilder(Feed, 'feeds')
      .setParameter('userId', user.id)
      .distinct(true) // TODO: Verificar porque esta sendo usado, DISTINCT deixa query muito lenta
      .leftJoinAndSelect('feeds.images', 'images')
      .leftJoin('feeds.user', 'user')
      .addSelect([
        'user.id',
        'user.name',
        'user.description',
        'user.birthDate',
        'user.friendlyName',
        'user.profilePhoto',
        'user.city',
        'user.state',
        'user.gender',
        'user.sendNotifications'
      ])
      .leftJoinAndSelect('feeds.likes', 'likes')
      .loadRelationCountAndMap('feeds.commentsCount', 'feeds.comments')
      .loadRelationCountAndMap('feeds.likesCount', 'feeds.likes');

    // TODO: Verificar se estava sendo usado
    // .loadRelationCountAndMap('feeds.isLiked', 'feeds.likes', 'myLikes', qb =>
    //   qb.andWhere('myLikes.userId = :userId', { userId: user.id })
    // )
    // .leftJoinAndSelect('likes.user', 'likesUser')
    // .leftJoinAndSelect('user.interests', 'interests');

    if (search) {
      queryBuilder
        .andWhere('feeds.text LIKE :search', { search: `%${search}%` })
        .orWhere('user.name LIKE :search', { userId: `%${search}%` })
        .orWhere('user.email LIKE :search', { userId: `%${search}%` });
    }

    queryBuilder.orderBy('feeds.createdAt', 'DESC');

    const result = await IPagination.paginate<Feed>(queryBuilder, paginationOptions);

    return result;
  }

  public async listUserFeed(user: User, paginationOptions: IPaginationOptions): Promise<IPaginated<Feed>> {
    const queryBuilder = getRepository(Feed)
      .createQueryBuilder('feeds')
      .leftJoinAndSelect('feeds.images', 'images')
      .leftJoin('feeds.user', 'user')
      .addSelect([
        'user.id',
        // 'user.email',
        'user.name',
        'user.description',
        'user.birthDate',
        'user.friendlyName',
        'user.profilePhoto',
        'user.city',
        'user.state',
        'user.gender',
        'user.sendNotifications'
      ])
      .where('feeds.userId = :userId', {
        userId: user.id
      });

    const result = await IPagination.paginate(queryBuilder, paginationOptions);

    return result;
  }

  public async findById(id: number): Promise<Feed> {
    return Feed.findOne(id, {
      relations: ['images', 'user', 'comments', 'comments.user', 'likes', 'likes.user']
    });
  }

  public async findOne(options: FindOneOptions<Feed>) {
    return Feed.findOne(options);
  }

  public async insert(model: Feed): Promise<Feed> {
    const feed = await Feed.save(model);
    return Feed.findOne(feed.id, {
      relations: ['images', 'user', 'comments', 'likes']
    });
  }

  public async update(model: Feed): Promise<Feed> {
    const feed = await Feed.save(model);
    return Feed.findOne(feed.id, {
      relations: ['images', 'user', 'comments', 'likes']
    });
  }

  public async remove(id: number): Promise<void> {
    await Feed.softRemove({ id } as Feed);
  }
}
