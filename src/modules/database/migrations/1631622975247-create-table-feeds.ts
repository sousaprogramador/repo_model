import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableFeeds1631622975247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('feeds');
    if (hasTable) return;
    queryRunner.createTable(
      new Table({
        name: 'feeds',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'text',
            type: 'text',
            isNullable: true
          },
          {
            name: 'userId',
            type: 'int'
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'deletedAt',
            type: 'datetime',
            isNullable: true,
            default: null
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'feeds',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('feeds');
  }
}
