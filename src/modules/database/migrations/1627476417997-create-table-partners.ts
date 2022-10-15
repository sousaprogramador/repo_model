import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTablePartners1627476417997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('partners');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'partners',
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
            name: 'logo',
            type: 'varchar'
          },
          {
            name: 'status',
            type: 'boolean',
            default: true
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'hideOffers',
            type: 'boolean',
            default: false
          },
          {
            name: 'whatsApp',
            type: 'varchar',
            isNullable: true
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
    await queryRunner.dropTable('partners');
  }
}
