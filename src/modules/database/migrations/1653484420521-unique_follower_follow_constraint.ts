import {MigrationInterface, QueryRunner, TableIndex, TableUnique} from "typeorm";

export class uniqueFollowerFollowConstraint1653484420521 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'follows',
            new TableIndex({ name: 'follower_followed_unique_index', columnNames: ['followerId', 'followedId'], isUnique: true })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
