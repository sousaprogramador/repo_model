import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableConfigs1631623085972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('configs');
    if (hasTable) return;
    queryRunner.createTable(
      new Table({
        name: 'configs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar(32)'
          },
          {
            name: 'value',
            type: 'varchar(32)'
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()',
            isNullable: true
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

    await queryRunner.manager.insert('configs', {
      name: 'min_app_version',
      value: '1.0.0'
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('configs');
  }
}
