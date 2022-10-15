import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class addColumnNotifications1651602026055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      `${await queryRunner.getCurrentDatabase()}.notifications`,
      'aggregatedNotificationId'
    );

    if (!hasColumn) {
      await queryRunner.addColumn(
        'notifications',
        new TableColumn({
          name: 'aggregatedNotificationId',
          type: 'int',
          default: null,
          isNullable: true
        })
      );

      await queryRunner.createForeignKey(
        'notifications',
        new TableForeignKey({
          columnNames: ['aggregatedNotificationId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'aggregatedNotifications'
          //onDelete: 'CASCADE'
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('notifications');
    if (!hasTable) return;

    const hasColumn = await queryRunner.hasColumn(
      `${await queryRunner.getCurrentDatabase()}.notifications`,
      'aggregatedNotificationId'
    );

    if (hasColumn) {
      await queryRunner.dropColumn('notifications', 'aggregatedNotificationId');
    }
  }
}
