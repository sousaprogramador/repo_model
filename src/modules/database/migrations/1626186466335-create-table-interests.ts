import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableInterests1626186466335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // await this.down(queryRunner); // aqui

    const hasTable = await queryRunner.hasTable('interests');
    if (hasTable) return;

    await queryRunner.createTable(
      new Table({
        name: 'interests',
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
            name: 'icon',
            type: 'varchar'
          },
          {
            name: 'position',
            type: 'int',
            default: 0
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
    await queryRunner.dropTable('interests');
  }
}
