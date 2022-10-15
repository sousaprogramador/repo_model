import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableBlockedUsers1626186531566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('blockedUsers');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'blockedUsers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
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
            default: null,
            isNullable: true
          },
          {
            name: 'userId',
            type: 'int'
          },
          {
            name: 'blockedUserId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'blockedUsers',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'blockedUsers',
      new TableForeignKey({
        columnNames: ['blockedUserId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('blockedUsers');
  }
}
