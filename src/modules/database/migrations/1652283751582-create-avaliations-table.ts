import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createAvaliationsTable1652283751582 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'avaliations',
            columns: [{
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            }, {
                name: 'text',
                type: 'text',
                isNullable: false,
            }, {
                name: 'rating',
                type: 'decimal(4,2)',
                isNullable: false,
            }, {
                name: 'userId',
                type: 'int',
                isNullable: false,
            }, {
                name: 'originUserId',
                type: 'int',
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
            foreignKeys: [{
                name: 'FKuserId',
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                columnNames: ['userId']
            }, {
                name: 'FKoriginUserId',
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                columnNames: ['originUserId']
            }],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('avaliations');
    }

}
