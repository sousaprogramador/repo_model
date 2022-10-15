import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableAggregatedNotifications1649193345906 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'aggregatedNotifications',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['follow', 'like', 'comment'],
            isNullable: true,
            default: null
          },
          {
            name: 'userId',
            type: 'int'
          },
          {
            name: 'originFeedId',
            type: 'int'
          },
          {
            name: 'lastStatus',
            type: 'enum',
            enum: ['unread', 'read', 'deleted'],
            default: '"unread"'
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'deletedAt',
            type: 'datetime',
            isNullable: true,
            default: null
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'aggregatedNotifications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users'
        //onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('aggregatedNotifications');
    if (!hasTable) return;
    await queryRunner.dropTable('aggregatedNotifications');
  }
}
