import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class avaliationAdjectives1652322096896 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'avaliationAdjectives',
            columns: [{
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            }, {
                name: 'avaliationId',
                type: 'int',
                isNullable: false,
            }, {
                name: 'adjectiveId',
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
                name: 'FKavaliationId',
                referencedTableName: 'avaliations',
                referencedColumnNames: ['id'],
                columnNames: ['avaliationId']
            }, {
                name: 'FKadjectiveId',
                referencedTableName: 'adjectives',
                referencedColumnNames: ['id'],
                columnNames: ['adjectiveId']
            }]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('avaliationAdjectives');
    }

}
