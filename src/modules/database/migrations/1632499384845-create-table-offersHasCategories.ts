import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableOffersHasCategories1632499384845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('offersHasCategories');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offersHasCategories',
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
            type: 'int'
          },
          {
            name: 'categoryId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'offersHasCategories',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedTableName: 'offersCategories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'offersHasCategories',
      new TableForeignKey({
        columnNames: ['offerId'],
        referencedTableName: 'offers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offersHasCategories');
  }
}
