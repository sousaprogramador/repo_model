import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnAggregatedNotifications1652449007054 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (!hasTable) return;
    await queryRunner.addColumn(
      'aggregatedNotifications',
      new TableColumn({
        name: 'lastUpdatedAtNotifications',
        type: 'datetime',
        isNullable: true,
        default: null
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      `${await queryRunner.getCurrentDatabase()}.aggregatedNotifications`,
      'lastUpdatedAtNotifications'
    );

    if (hasColumn) {
      await queryRunner.dropColumn('aggregatedNotifications', 'lastUpdatedAtNotifications');
    }
  }
}
