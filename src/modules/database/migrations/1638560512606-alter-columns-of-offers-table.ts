import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterColumnsOfOffersTable1638560512606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offers MODIFY COLUMN content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL;`
    );

    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offers MODIFY COLUMN price varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;`
    );

    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offers MODIFY COLUMN startDate date NULL;`
    );

    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offers MODIFY COLUMN endDate date NULL;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offers MODIFY COLUMN content text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;`
    );

    await queryRunner.dropColumn(`${await queryRunner.getCurrentDatabase()}.offers`, 'price');

    await queryRunner.dropColumn(`${await queryRunner.getCurrentDatabase()}.startDate`, 'price');

    await queryRunner.dropColumn(`${await queryRunner.getCurrentDatabase()}.endDate`, 'price');
  }
}
