import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class removingNotNullAggregatedNotifications1653872031717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('alter table aggregatedNotifications modify originFeedId int null');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('alter table aggregatedNotifications modify originFeedId int not null');
    }

}
