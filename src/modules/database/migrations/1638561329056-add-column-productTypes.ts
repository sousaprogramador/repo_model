import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnProductTypes1638561329056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn(`${await queryRunner.getCurrentDatabase()}.productsTypes`, 'color');

    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.productsTypes ADD color varchar(30) NULL;`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(`${await queryRunner.getCurrentDatabase()}.productsTypes`, 'color');
  }
}
