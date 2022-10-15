import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableDestinationsHasCategories1626186457005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('destinationsHasCategories');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'destinationsHasCategories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'destinationId',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'categoryId',
            type: 'int',
            isPrimary: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'destinationsHasCategories',
      new TableForeignKey({
        columnNames: ['destinationId'],
        referencedTableName: 'destinations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'destinationsHasCategories',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'destinationsCategories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('destinationsHasCategories');
  }
}
