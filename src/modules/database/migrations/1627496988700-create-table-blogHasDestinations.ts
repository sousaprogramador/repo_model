import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableBlogHasDestinations1627496988700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('blogHasDestinations');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'blogHasDestinations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'blogId',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'destinationId',
            type: 'int',
            isPrimary: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'blogHasDestinations',
      new TableForeignKey({
        columnNames: ['blogId'],
        referencedTableName: 'blogs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'blogHasDestinations',
      new TableForeignKey({
        columnNames: ['destinationId'],
        referencedTableName: 'destinations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('blogHasDestinations');
  }
}
