import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnOfferCategory1638367888296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'offersCategories',
      new TableColumn({
        name: 'position',
        type: 'int',
        isNullable: false,
        default: 99
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('offersCategories', 'position');
  }
}
