import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTablePreferences1626186472286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('preferences');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'preferences',
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
            type: 'varchar'
          },
          {
            name: 'status',
            type: 'boolean',
            default: true
          },
          {
            name: 'defaultValue',
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
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('preferences');
  }
}
