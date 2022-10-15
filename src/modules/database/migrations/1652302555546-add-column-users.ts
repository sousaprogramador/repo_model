import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnUsers1652302555546 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (!hasTable) return;
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'statusIconNotifications',
        type: 'enum',
        enum: ['read', 'unread'],
        isNullable: true,
        default: "'read'"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('users');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      `${await queryRunner.getCurrentDatabase()}.users`,
      'statusIconNotifications'
    );

    if (hasColumn) {
      await queryRunner.dropColumn('users', 'statusIconNotifications');
    }
  }
}
