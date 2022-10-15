import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableNotifications1649191573569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('notifications');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
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
            name: 'originModelId',
            type: 'int'
          },
          {
            name: 'originUserId',
            type: 'int'
          },
          {
            name: 'status',
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
      'notifications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users'
        //onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['originUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users'
        //onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('notifications');
    if (!hasTable) return;
    await queryRunner.dropTable('notifications');
  }
}
