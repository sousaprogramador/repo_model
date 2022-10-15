import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableOffersHasProductsTypes1635344227356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offerHasProductsTypes');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offerHasProductsTypes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'offerId',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'productTypeId',
            type: 'int',
            isPrimary: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'offerHasProductsTypes',
      new TableForeignKey({
        columnNames: ['offerId'],
        referencedTableName: 'offers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'offerHasProductsTypes',
      new TableForeignKey({
        columnNames: ['productTypeId'],
        referencedTableName: 'productsTypes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offerHasProductsTypes');
  }
}
