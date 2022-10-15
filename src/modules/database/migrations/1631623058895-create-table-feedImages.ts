import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableFeedImages1631623058895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('feedImages');
    if (hasTable) return;
    queryRunner.createTable(
      new Table({
        name: 'feedImages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'filename',
            type: 'varchar(256)'
          },
          {
            name: 'feedId',
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
      'feedImages',
      new TableForeignKey({
        columnNames: ['feedId'],
        referencedTableName: 'feeds',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('feedImages');
  }
}
