import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterColumnPosition1638556156088 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offersCategories MODIFY COLUMN position int(11) DEFAULT NULL NULL;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('offersCategories', 'position');
  }
}
