import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTableOfferDataPackage1635423643804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'offers',
      new TableColumn({
        name: 'startDatePackage',
        type: 'date',
        isNullable: true,
        default: null
      })
    );

    await queryRunner.addColumn(
      'offers',
      new TableColumn({
        name: 'endDatePackage',
        type: 'date',
        isNullable: true,
        default: null
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('startDatePackage', 'endDatePackage');
  }
}
