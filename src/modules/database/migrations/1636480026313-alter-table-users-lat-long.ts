import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterTableUsersLatLong1636480026313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lat',
        type: 'numeric(10,6)',
        isNullable: true,
        default: null
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'lon',
        type: 'numeric(10,6)',
        isNullable: true,
        default: null
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lat', 'lon');
  }
}
