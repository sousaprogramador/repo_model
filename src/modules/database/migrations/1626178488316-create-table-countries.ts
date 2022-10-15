import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableCountries1626178488316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await this.down(queryRunner); // aqui
    await queryRunner.query(
      `ALTER DATABASE ${await queryRunner.getCurrentDatabase()} CHARACTER SET utf8 COLLATE utf8_general_ci;`
    );

    const hasTable = await queryRunner.hasTable('countries');
    if (hasTable) return;

    await queryRunner.createTable(
      new Table({
        name: 'countries',
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
    await queryRunner.dropTable('countries');
  }
}
