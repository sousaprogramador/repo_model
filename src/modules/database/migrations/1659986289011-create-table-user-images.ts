import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUserImages1659986289011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('usersImages');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'usersImages',
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
      'usersImages',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usersImages');
  }
}
