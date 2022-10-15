import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableFeedComments1631623049165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('feedComments');
    if (hasTable) return;
    queryRunner.createTable(
      new Table({
        name: 'feedComments',
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
            type: 'text'
          },
          {
            name: 'userId',
            type: 'int'
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
      'feedComments',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'feedComments',
      new TableForeignKey({
        columnNames: ['feedId'],
        referencedTableName: 'feeds',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('feedComments');
  }
}
