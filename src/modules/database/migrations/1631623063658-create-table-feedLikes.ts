import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableFeedLikes1631623063658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('feedLikes');
    if (hasTable) return;
    queryRunner.createTable(
      new Table({
        name: 'feedLikes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
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
            name: 'like',
            type: 'tinyint(1)',
            default: true
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
      'feedLikes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'feedLikes',
      new TableForeignKey({
        columnNames: ['feedId'],
        referencedTableName: 'feeds',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('feedLikes');
  }
}
