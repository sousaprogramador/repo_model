import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCharsetFeeds1652387263424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('feeds');
    if (!hasTable) return;
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.feeds CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.feeds modify text text charset utf8mb4;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
