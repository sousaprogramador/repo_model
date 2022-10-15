import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableRefreshToken1631623142839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('refreshToken');
    if (hasTable) return;
    queryRunner.createTable(
      new Table({
        name: 'refreshToken',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'userId',
            type: 'int'
          },
          {
            name: 'refreshToken',
            type: 'varchar'
          },
          {
            name: 'expiresIn',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'refreshToken',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('refreshToken');
  }
}
