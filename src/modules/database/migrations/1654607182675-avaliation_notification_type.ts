import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class avaliationNotificationType1654607182675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('notifications', 'type', new TableColumn({
            name: 'type',
            type: 'enum',
            enum: ['follow', 'like', 'comment', 'avaliation'],
            isNullable: true,
            default: null
        }));

        await queryRunner.changeColumn('aggregatedNotifications', 'type', new TableColumn({
            name: 'type',
            type: 'enum',
            enum: ['follow', 'like', 'comment', 'avaliation'],
            isNullable: true,
            default: null
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('notifications', 'type', new TableColumn({
            name: 'type',
            type: 'enum',
            enum: ['follow', 'like', 'comment'],
            isNullable: true,
            default: null
        }));

        await queryRunner.changeColumn('aggregatedNotifications', 'type', new TableColumn({
            name: 'type',
            type: 'enum',
            enum: ['follow', 'like', 'comment'],
            isNullable: true,
            default: null
        }));
    }

}
