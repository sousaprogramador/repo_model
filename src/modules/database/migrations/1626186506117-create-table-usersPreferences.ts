import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUsersPreferences1626186506117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('usersPreferences');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'usersPreferences',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'value',
            type: 'int',
            default: 1
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
          },
          {
            name: 'preferenceId',
            type: 'int'
          },
          {
            name: 'userId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'usersPreferences',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'usersPreferences',
      new TableForeignKey({
        columnNames: ['preferenceId'],
        referencedTableName: 'preferences',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usersPreferences');
  }
}
