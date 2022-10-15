import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterColumnsEnumUsers1638560532857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.users MODIFY COLUMN sexualOrientation enum('straight','homosexual','bisexual','shemale','other', '') CHARACTER SET utf8 COLLATE utf8_general_ci NULL;`
    );
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.users MODIFY COLUMN maritalStatus enum('married','single','divorced','relationship','open', '') CHARACTER SET utf8 COLLATE utf8_general_ci NULL;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.users MODIFY COLUMN sexualOrientation enum('straight','homosexual','bisexual','shemale','other') CHARACTER SET utf8 COLLATE utf8_general_ci NULL;`
    );
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.users MODIFY COLUMN maritalStatus enum('married','single','divorced','relationship','open') CHARACTER SET utf8 COLLATE utf8_general_ci NULL;`
    );
  }
}
