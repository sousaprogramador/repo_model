import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTableDestinationsDescription1635941366391 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'destinations',
      'description',
      new TableColumn({
        name: 'description',
        type: 'mediumText'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('destinations', 'description');
  }
}
