import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnOffers1637954214553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'offers',
      new TableColumn({
        name: 'priceLabel',
        type: 'varchar(15)',
        isNullable: true,
        default: '"A partir de"'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('offers', 'priceLabel');
  }
}
