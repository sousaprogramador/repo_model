import { Injectable } from "@nestjs/common";
import { IPaginated, IPagination, IPaginationOptions } from "src/modules/common/services/pagination";
import { Follow } from "src/modules/database/models/follows.entity";
import { In } from "typeorm";

@Injectable()
class FollowsRepository {
    public async upsert(data: Partial<Follow>): Promise<Follow> {
        const foundFollow = await Follow.findOne({ followerId: data.followerId, followedId: data.followedId }, { withDeleted: true });

        if (!foundFollow) {
            const newFollow = new Follow(data);
            const result = await newFollow.save();

            return result;
        }

        foundFollow.deletedAt = null;
        const result = await foundFollow.save();

        return result;
    }

    public async followers(id: number, user: number, paginationOptions?: IPaginationOptions): Promise<IPaginated<Follow>> {
        const result = await IPagination.paginate(
            Follow.getRepository(),
            paginationOptions,
            {
                where: { followedId: id },
                relations: ['follower'],
            }
        );

        result.items = await Promise.all(result.items.map(async (item) => {
            const followInfo = await this.followInfo(user, item.followerId);
            
            item.followMe = followInfo.isFollower;
            item.imFollowing = followInfo.imFollowing;

            return item;
        }));

        return result;
    }

    public async follows(id: number, user: number, paginationOptions?: IPaginationOptions): Promise<IPaginated<Follow>> {
        const result = await IPagination.paginate(
            Follow.getRepository(),
            paginationOptions,
            {
                where: { followerId: id },
                relations: ['followed'],
            }
        );

        result.items = await Promise.all(result.items.map(async (item) => {
            const followInfo = await this.followInfo(user, item.followedId);
            
            item.followMe = followInfo.isFollower;
            item.imFollowing = followInfo.imFollowing;

            return item;
        }));

        return result;
    }

    public async followedBy(id: number, followedId: number, paginationsOptions?: IPaginationOptions): Promise<IPaginated<Follow>> {
        if (!paginationsOptions) {
            paginationsOptions = { limit: 3, page: 1 };
        }

        const myFollows = await Follow.find({
            where: { followerId: id },
            select: ['followedId'],
        });

        const userIds = myFollows.map((follow) => follow.followedId);

        const result = await IPagination.paginate(
            Follow.getRepository(),
            paginationsOptions,
            {
                where: { followedId, followerId: In(userIds) },
                relations: ['follower'],
            }
        );

        return result;
    }

    public async delete(followerId: number, followedId: number): Promise<Follow | undefined> {
        const foundFollow = await Follow.findOne({ followerId, followedId });
        if (!foundFollow) return;

        const deletedFollow = await foundFollow.softRemove();

        return deletedFollow;
    }

    public async followInfo(principalUser: number, secondaryUser: number): Promise<{ imFollowing: boolean, isFollower: boolean }> {
        const imFollowing = await Follow.findOne({ followerId: principalUser, followedId: secondaryUser });
        const isFollower = await Follow.findOne({ followerId: secondaryUser, followedId: principalUser });

        return { imFollowing: !!imFollowing, isFollower: !!isFollower };
    }

    public async followNumbers(id: number): Promise<{ followsNumber: number, followersNumber: number }> {
        const followsNumber = await Follow.count({ followerId: id });
        const followersNumber = await Follow.count({ followedId: id });

        return { followsNumber, followersNumber };
    }
}

export { FollowsRepository };
