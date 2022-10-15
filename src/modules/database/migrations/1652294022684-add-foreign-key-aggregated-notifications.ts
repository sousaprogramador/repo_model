import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class addForeignKeyAggregatedNotifications1652294022684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (!hasTable) return;
    await queryRunner.createForeignKey(
      'aggregatedNotifications',
      new TableForeignKey({
        columnNames: ['originFeedId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'feeds'
        //onDelete: 'CASCADE'
      })
    );
  }

  // Não tem como desfazer
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
