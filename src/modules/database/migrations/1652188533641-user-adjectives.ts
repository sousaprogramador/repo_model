import {MigrationInterface, QueryRunner, Table, TableColumn, PrimaryColumn } from "typeorm";

export class userAdjectives1652188533641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'adjectives',
                columns: [{
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                }, {
                    name: 'text',
                    type: 'varchar(255)',
                    isNullable: false,
                }, {
                    name: 'icon',
                    type: 'varchar(500)',
                    isNullable: false,
                }, {
                    name: 'minRating',
                    type: 'decimal(4,2)',
                    isNullable: false,
                }, {
                    name: 'maxRating',
                    type: 'decimal(4,2)',
                    isNullable: false,
                }, {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'now()'
                }, {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'now()'
                }, {
                    name: 'deletedAt',
                    type: 'datetime',
                    isNullable: true,
                    default: null
                }],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('adjectives');
    }

}
