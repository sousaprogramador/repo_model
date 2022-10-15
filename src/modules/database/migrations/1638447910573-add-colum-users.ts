import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumUsers1638447910573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'sendNotifications',
        type: 'tinyint',
        default: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'sendNotifications');
  }
}
