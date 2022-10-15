import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnOffersCategories1656701108064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offersCategories');
    if (!hasTable) return;
    await queryRunner.addColumn(
      'offersCategories',
      new TableColumn({
        name: 'icon',
        type: 'varchar(255)',
        isNullable: true,
        default: null
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offersCategories');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(`${await queryRunner.getCurrentDatabase()}.offersCategories`, 'icon');

    if (hasColumn) {
      await queryRunner.dropColumn('offersCategories', 'icon');
    }
  }
}
