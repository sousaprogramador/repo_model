import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnOffersCategoriesGroups1656710280291 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offersCategoriesGroups');
    if (!hasTable) return;
    await queryRunner.addColumn(
      'offersCategoriesGroups',
      new TableColumn({
        name: 'icon',
        type: 'varchar(255)',
        isNullable: true,
        default: null
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offersCategoriesGroups');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      `${await queryRunner.getCurrentDatabase()}.offersCategoriesGroups`,
      'icon'
    );

    if (hasColumn) {
      await queryRunner.dropColumn('offersCategoriesGroups', 'icon');
    }
  }
}
