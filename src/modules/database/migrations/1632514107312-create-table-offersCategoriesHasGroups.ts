import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableOffersCategoriesHasGroups1632514107312 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offersCategoriesHasGroups');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offersCategoriesHasGroups',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'categoryId',
            type: 'int'
          },
          {
            name: 'groupId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'offersCategoriesHasGroups',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'offersCategories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'offersCategoriesHasGroups',
      new TableForeignKey({
        columnNames: ['groupId'],
        referencedTableName: 'offersCategoriesGroups',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offersCategoriesHasGroups');
  }
}
