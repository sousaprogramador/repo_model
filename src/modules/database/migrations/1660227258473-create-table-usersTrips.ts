import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUsersTrips1660227258473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('usersTrips');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'usersTrips',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'filename',
            type: 'varchar'
          },
          {
            name: 'userId',
            type: 'int'
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
      'usersTrips',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usersTrips');
  }
}
